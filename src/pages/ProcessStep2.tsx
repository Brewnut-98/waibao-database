import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, FileText, Image, Table, BarChart3, Tag, RefreshCw, Sparkles, Edit2, Edit3, Trash2, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import TableEditor from '../components/TableEditor';
import FlowchartEditor from '../components/FlowchartEditor';

interface ExtractedCard {
  id: string;
  type: 'text' | 'image';
  title: string;
  content: string;
  sourcePageNumber: number;
  sourceChapter: string;
  confidence: number;
  isMerged?: boolean;
}

interface ProcessedCard {
  id: string;
  originalId: string;
  type: 'text' | 'table' | 'chart' | 'formula';
  title: string;
  content: string;
  tags: string[];
  category: string;
  summary: string;
  sourcePageNumber: number;
  confidence: number;
  aiProcessed: boolean;
}

const ProcessStep2 = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [selectedProcessedCard, setSelectedProcessedCard] = useState<string>('');
  const [processedCards, setProcessedCards] = useState<ProcessedCard[]>([]);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('第一章 概述');
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  
  // AI处理进度状态
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(45); // 剩余秒数
  
  // 右侧卡片编辑状态
  const [editingProcessedCardId, setEditingProcessedCardId] = useState<string | null>(null);
  const [editingProcessedTitle, setEditingProcessedTitle] = useState<string>('');
  const [editingProcessedContent, setEditingProcessedContent] = useState<string>('');
  const [editingProcessedTags, setEditingProcessedTags] = useState<string[]>([]);



  // 流程图编辑器状态
  const [showFlowchartEditor, setShowFlowchartEditor] = useState<boolean>(false);
  const [flowchartEditingCardId, setFlowchartEditingCardId] = useState<string | null>(null);
  
  // 章节处理状态
  const [chapterProcessingStatus, setChapterProcessingStatus] = useState<{[key: string]: 'pending' | 'processing' | 'completed'}>({
    '第一章 概述': 'completed',
    '第二章 风险管理': 'processing',
    '第三章 监管要求': 'pending'
  });
  const [currentProcessingChapter, setCurrentProcessingChapter] = useState<string>('第二章 风险管理');
  
  // 添加处理完成状态，用于控制顶部区域的显示
  const [isProcessingCompleted, setIsProcessingCompleted] = useState<boolean>(false);
  
  // 固定的数据 - 第一章只有3个卡片，第三个是合并图片
  const [extractedCards, setExtractedCards] = useState<ExtractedCard[]>([
    // 第一章 - 只有3个卡片
    {
      id: 'card_1',
      type: 'text',
      title: '概述章节内容',
      content: '本指南旨在为企业提供全面的法律合规框架，确保业务运营符合相关法律法规要求。',
      sourcePageNumber: 1,
      sourceChapter: '第一章 概述',
      confidence: 0.95
    },
    {
      id: 'card_2',
      type: 'text',
      title: '合规体系重要性说明',
      content: '法律合规不仅是企业的法定义务，更是企业可持续发展的重要保障。有效的合规体系能够预防法律风险和监管处罚、提升企业治理水平、增强投资者和客户信心、维护企业声誉和品牌价值。',
      sourcePageNumber: 1,
      sourceChapter: '第一章 概述',
      confidence: 0.92
    },
    {
      id: 'card_3',
      type: 'image',
      title: '组织架构图',
      content: '合并展示：上半部分显示企业合规管理的组织架构，下半部分显示详细的部门关系',
      sourcePageNumber: 1,
      sourceChapter: '第一章 概述',
      confidence: 0.88,
      isMerged: true
    },
    // 第二章 - 4个卡片：文本、图片、图片、图片
    {
      id: 'card_4',
      type: 'text',
      title: '风险管理机制',
      content: '企业应当建立系统性的风险识别机制，定期评估内外部环境变化对业务合规性的影响。主要风险类型包括监管风险、操作风险、声誉风险等。',
      sourcePageNumber: 2,
      sourceChapter: '第二章 风险管理',
      confidence: 0.90
    },
    {
      id: 'card_5',
      type: 'image',
      title: '风险评估矩阵',
      content: '展示不同风险类型的发生概率、影响程度和风险等级评估表格',
      sourcePageNumber: 2,
      sourceChapter: '第二章 风险管理',
      confidence: 0.85
    },
    {
      id: 'card_6',
      type: 'image',
      title: '风险管控流程图',
      content: '展示风险识别、评估、应对和监控的完整流程图',
      sourcePageNumber: 2,
      sourceChapter: '第二章 风险管理',
      confidence: 0.83
    },
    {
      id: 'card_7',
      type: 'image',
      title: '合规数学模型',
      content: '展示企业合规管理的数学建模公式和计算逻辑',
      sourcePageNumber: 2,
      sourceChapter: '第二章 风险管理',
      confidence: 0.88
    },
    // 第三章
    {
      id: 'card_8',
      type: 'text',
      title: '监管要求详述',
      content: '企业需要严格遵守相关监管机构的要求，包括但不限于证监会、银保监会、央行等部门的规定。定期关注法规更新，及时调整内部制度。',
      sourcePageNumber: 3,
      sourceChapter: '第三章 监管要求',
      confidence: 0.93
    },
    // 新增：第三章的图片卡片
    {
      id: 'card_9',
      type: 'image',
      title: '监管框架图',
      content: '展示企业监管合规的完整框架体系和监管机构关系图',
      sourcePageNumber: 3,
      sourceChapter: '第三章 监管要求',
      confidence: 0.89
    }
  ]);

  // 获取所有章节
  const availableChapters = Array.from(new Set(extractedCards.map(card => card.sourceChapter)));
  
  // 过滤当前章节的卡片
  const filteredExtractedCards = extractedCards.filter(card => card.sourceChapter === selectedChapter);
  const filteredProcessedCards = processedCards.filter(card => 
    extractedCards.find(ec => ec.id === card.originalId)?.sourceChapter === selectedChapter
  );
  
  // 章节导航函数
  const goToPrevChapter = () => {
    if (currentChapterIndex > 0) {
      const newIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(newIndex);
      setSelectedChapter(availableChapters[newIndex]);
    }
  };
  
  const goToNextChapter = () => {
    if (currentChapterIndex < availableChapters.length - 1) {
      const newIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(newIndex);
      setSelectedChapter(availableChapters[newIndex]);
    }
  };
  
  // 提取章节编号
  const getCurrentChapterNumber = () => {
    const match = selectedChapter.match(/第(.+?)章/);
    return match ? `第${match[1]}章` : selectedChapter;
  };

  // 模拟AI处理进度 - 按章节处理
  useEffect(() => {
    if (isProcessing) {
      const timer = setTimeout(() => {
        setProcessedCount(prev => {
          const newCount = prev + 1;
          // 获取当前章节的卡片数量
          const currentChapterCards = extractedCards.filter(card => card.sourceChapter === currentProcessingChapter);
          
          // 如果当前章节处理完成，切换到下一个未完成的章节
          if (newCount >= currentChapterCards.length) {
            const nextChapter = availableChapters.find(chapter => 
              chapterProcessingStatus[chapter] === 'pending'
            );
            
            if (nextChapter) {
              // 标记当前章节为已完成
              setChapterProcessingStatus(prev => ({
                ...prev,
                [currentProcessingChapter]: 'completed',
                [nextChapter]: 'processing'
              }));
              setCurrentProcessingChapter(nextChapter);
              return 0; // 重新开始处理下一章节
            } else {
              // 所有章节都处理完了，循环处理
              setChapterProcessingStatus({
                '第一章 概述': 'completed',
                '第二章 风险管理': 'processing',
                '第三章 监管要求': 'pending'
              });
              setCurrentProcessingChapter('第二章 风险管理');
              return 0;
            }
          }
          return newCount;
        });
        
        setRemainingTime(prev => {
          const newTime = prev - 8;
          if (newTime <= 0) {
            return 45;
          }
          return newTime;
        });
      }, 2000); // 每2秒处理一个卡片
      
      return () => clearTimeout(timer);
    }
  }, [isProcessing, processedCount, extractedCards.length, currentProcessingChapter, chapterProcessingStatus, availableChapters]);

  // 初始化AI处理结果
  useEffect(() => {
    if (extractedCards.length > 0 && processedCards.length === 0) {
      // 直接显示AI处理结果
      const mockProcessedCards: ProcessedCard[] = extractedCards.map((card, index) => {
        // 特殊处理第二章的4个卡片：文本、表格、公式、流程图
        if (card.sourceChapter === '第二章 风险管理') {
          if (card.id === 'card_4') {
            // 第一个：文本
            return {
              id: `processed_${card.id}`,
              originalId: card.id,
              type: 'text',
              title: card.title,
              content: card.content,
              tags: ['风险管理', '制度建设', '法律合规'],
              category: '风险管理',
              summary: `这是关于${card.title}的重要内容，涉及企业风险管理体系建设的核心要素。`,
              sourcePageNumber: card.sourcePageNumber,
              confidence: Math.min(0.98, card.confidence + 0.05),
              aiProcessed: true
            };
          } else if (card.id === 'card_5') {
            // 第二个：表格
            return {
              id: `processed_${card.id}`,
              originalId: card.id,
              type: 'table',
              title: card.title,
              content: '风险类型 | 发生概率 | 影响程度 | 风险等级\n监管风险 | 高 | 严重 | 极高\n操作风险 | 中 | 中等 | 中等\n声誉风险 | 低 | 严重 | 中高',
              tags: ['数据表格', '风险评估', '分类管理'],
              category: '数据表格',
              summary: `已将风险评估矩阵转换为结构化表格，便于数据分析和处理。`,
              sourcePageNumber: card.sourcePageNumber,
              confidence: Math.min(0.95, card.confidence + 0.05),
              aiProcessed: true
            };
          } else if (card.id === 'card_6') {
            // 第三个：流程图
            return {
              id: `processed_${card.id}`,
              originalId: card.id,
              type: 'chart',
              title: card.title,
              content: '流程图数据：风险识别 → 风险评估 → 风险应对 → 风险监控 → 持续改进',
              tags: ['流程图', '风险管控', '业务流程'],
              category: '流程图表',
              summary: `已将风险管控流程图转换为数据图表，清晰展示风险管理的完整流程。`,
              sourcePageNumber: card.sourcePageNumber,
              confidence: Math.min(0.92, card.confidence + 0.03),
              aiProcessed: true
            };
          } else if (card.id === 'card_7') {
            // 第四个：公式
            return {
              id: `processed_${card.id}`,
              originalId: card.id,
              type: 'formula',
              title: card.title,
              content: '风险值 = 发生概率 × 影响程度\n合规指数 = Σ(权重i × 评分i)\n其中：权重i ∈ [0,1]，评分i ∈ [1,10]',
              tags: ['数学公式', '计算模型', '量化分析'],
              category: '数学模型',
              summary: `已将合规数学模型转换为标准公式，用于量化风险评估和合规计算。`,
              sourcePageNumber: card.sourcePageNumber,
              confidence: Math.min(0.90, card.confidence + 0.02),
              aiProcessed: true
            };
          }
        }
        
        // 其他章节的处理逻辑
        if (card.type === 'text') {
          // 文本卡片的AI处理
          return {
            id: `processed_${card.id}`,
            originalId: card.id,
            type: 'text',
            title: card.title,
            content: card.content,
            tags: ['法律合规', '企业管理', '风险控制'],
            category: '合规管理',
            summary: `这是关于${card.title.replace('概述章节内容', '企业法律合规框架')}的重要内容，涉及合规体系建设的核心要素。`,
            sourcePageNumber: card.sourcePageNumber,
            confidence: Math.min(0.98, card.confidence + 0.05),
            aiProcessed: true
          };
        } else {
          // 图片卡片转换为表格/图表
          if (card.isMerged) {
            // 合并图片特殊处理
            return {
              id: `processed_${card.id}`,
              originalId: card.id,
              type: 'table',
              title: card.title,
              content: '部门层级 | 职责范围 | 负责人 | 汇报关系\n董事会 | 战略决策 | 董事长 | -\n合规委员会 | 合规监督 | 合规总监 | 董事会\n法务部 | 法律事务 | 法务经理 | 合规委员会\n风控部 | 风险管控 | 风控经理 | 合规委员会',
              tags: ['组织架构', '管理层级', '合并数据'],
              category: '组织管理',
              summary: `已将合并的组织架构图转换为结构化表格，清晰展示了企业合规管理的完整组织体系。`,
              sourcePageNumber: card.sourcePageNumber,
              confidence: Math.min(0.95, card.confidence + 0.05),
              aiProcessed: true
            };
          } else {
            const imageTypes = ['table', 'chart'];
            const selectedType = imageTypes[index % 2] as 'table' | 'chart';
            
            return {
              id: `processed_${card.id}`,
              originalId: card.id,
              type: selectedType,
              title: card.title,
              content: selectedType === 'table' ? 
                '监管机构 | 监管范围 | 主要法规 | 处罚措施\n证监会 | 证券市场 | 证券法 | 罚款、警告\n银保监会 | 银行保险 | 银行业监督管理法 | 限制业务\n央行 | 货币政策 | 人民银行法 | 约谈、整改' :
                '图表数据：合规监管-证监会、银保监会、央行等机构的监管要求',
              tags: selectedType === 'table' ? 
                ['数据表格', '监管要求', '分类管理'] : 
                ['数据图表', '可视化', '趋势分析'],
              category: selectedType === 'table' ? '数据表格' : '数据图表',
              summary: `已将图片${selectedType === 'table' ? '转换为结构化表格' : '转换为数据图表'}，便于数据分析和处理。`,
              sourcePageNumber: card.sourcePageNumber,
              confidence: Math.min(0.92, card.confidence + 0.03),
              aiProcessed: true
            };
          }
        }
      });
      
      setProcessedCards(mockProcessedCards);
    }
  }, [extractedCards]);

  const handleRetryProcessing = () => {
    setProcessedCards([]);
    // 重新执行AI处理逻辑
  };

  const handleEditCard = (cardId: string) => {
    // 实现卡片编辑功能
    console.log('编辑卡片:', cardId);
  };

  const handleProceedToStep3 = () => {
    // 跳转到第三步验证（写死ID为1）
    navigate(`/process-step3/1`, {
      state: { processedCards }
    });
  };



  // 流程图编辑器相关函数
  const handleOpenFlowchartEditor = (cardId: string) => {
    setFlowchartEditingCardId(cardId);
    setShowFlowchartEditor(true);
  };

  const handleCloseFlowchartEditor = () => {
    setShowFlowchartEditor(false);
    setFlowchartEditingCardId(null);
  };

  const handleSaveFlowchart = (newContent: string) => {
    if (flowchartEditingCardId) {
      setProcessedCards(prev =>
        prev.map(c =>
          c.id === flowchartEditingCardId ? { ...c, content: newContent } : c
        )
      );
    }
  };

  const handleSaveFlowchartTags = (newTags: string[]) => {
    if (flowchartEditingCardId) {
      setProcessedCards(prev =>
        prev.map(c =>
          c.id === flowchartEditingCardId ? { ...c, tags: newTags } : c
        )
      );
    }
  };

  const handleSaveFlowchartTitle = (newTitle: string) => {
    if (flowchartEditingCardId) {
      setProcessedCards(prev =>
        prev.map(c =>
          c.id === flowchartEditingCardId ? { ...c, title: newTitle } : c
        )
      );
    }
  };

  const renderExtractedCard = (card: ExtractedCard) => {
    // 检查是否有对应的右侧卡片被选中，如果有则高亮显示这个左侧卡片
    const correspondingProcessedCard = processedCards.find(pc => pc.originalId === card.id);
    const isHighlighted = correspondingProcessedCard && selectedProcessedCard === correspondingProcessedCard.id;
    
    const getTypeIcon = () => {
      switch (card.type) {
        case 'text':
          return <FileText className="h-4 w-4 text-blue-500" />;
        case 'image':
          return <Image className="h-4 w-4 text-purple-500" />;
        default:
          return <FileText className="h-4 w-4 text-gray-500" />;
      }
    };

    const renderContent = () => {
      switch (card.type) {
        case 'text':
          return (
            <p className="text-sm text-gray-600 line-clamp-3">
              {card.content}
            </p>
          );
        case 'image':
          if (card.isMerged) {
            // 合并图片的特殊展示 - 上下排列
            return (
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-center h-12 bg-gray-100 rounded border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Image className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">架构图上半部分</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center h-12 bg-gray-100 rounded border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Image className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">架构图下半部分</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">{card.content}</p>
              </div>
            );
          } else {
            return (
              <div className="flex items-center justify-center h-20 bg-gray-100 rounded border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Image className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">{card.content}</p>
                </div>
              </div>
            );
          }
      }
    };


    
    return (
      <div
        key={card.id}
        className={`card p-4 transition-shadow ${
          isHighlighted ? 'ring-2 ring-blue-400 bg-blue-50 shadow-lg' : 'border border-gray-200'
        }`}
      >
        {/* 顶部：图标 + 章节标签 + 页面标签 + 合并标签 */}
        <div className="flex items-center gap-2 mb-3">
          {getTypeIcon()}
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
            {card.sourceChapter}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
            第{card.sourcePageNumber}页
          </span>
          {card.isMerged && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
              合并图片
            </span>
          )}
        </div>
        
        {/* 内容区域 */}
        {renderContent()}
      </div>
    );
  };

  const renderProcessedCard = (card: ProcessedCard) => {
    const isEditing = editingProcessedCardId === card.id;
    
    const getTypeIcon = () => {
      switch (card.type) {
        case 'text':
          return <FileText className="h-4 w-4 text-blue-500" />;
        case 'table':
          return <Table className="h-4 w-4 text-green-500" />;
        case 'chart':
          return <BarChart3 className="h-4 w-4 text-purple-500" />;
        case 'formula':
          return <Tag className="h-4 w-4 text-orange-500" />;
        default:
          return <FileText className="h-4 w-4 text-gray-500" />;
      }
    };

    const handleStartEdit = () => {
      setEditingProcessedCardId(card.id);
      setEditingProcessedTitle(card.title);
      setEditingProcessedContent(card.content);
      setEditingProcessedTags([...card.tags]);
    };

    const handleSaveEdit = () => {
      setProcessedCards(prev => 
        prev.map(c => 
          c.id === card.id ? {
            ...c,
            title: editingProcessedTitle,
            // 公式卡片不修改内容，其他类型卡片修改内容
            content: card.type === 'formula' ? c.content : editingProcessedContent,
            tags: editingProcessedTags
          } : c
        )
      );
      setEditingProcessedCardId(null);
    };

    const handleCancelEdit = () => {
      setEditingProcessedCardId(null);
      setEditingProcessedTitle('');
      setEditingProcessedContent('');
      setEditingProcessedTags([]);
    };

    const handleAddTag = () => {
      setEditingProcessedTags([...editingProcessedTags, '新标签']);
    };

    const handleUpdateTag = (index: number, value: string) => {
      const newTags = [...editingProcessedTags];
      newTags[index] = value;
      setEditingProcessedTags(newTags);
    };

    const handleRemoveTag = (index: number) => {
      setEditingProcessedTags(editingProcessedTags.filter((_, i) => i !== index));
    };



    return (
              <div
          key={card.id}
          className={`rounded-lg p-4 transition-shadow ${
            selectedProcessedCard === card.id 
              ? 'bg-white border-2 border-blue-400 shadow-lg' 
              : 'bg-white border border-gray-200 hover:shadow-md'
          }`}
        onClick={(e) => {
          if (!isEditing) {
            setSelectedProcessedCard(card.id);
          }
        }}
      >
        {/* 图标、标题和编辑按钮 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            {getTypeIcon()}
            {isEditing ? (
              <input
                type="text"
                value={editingProcessedTitle}
                onChange={(e) => setEditingProcessedTitle(e.target.value)}
                className="flex-1 text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-sm font-medium text-gray-900">{card.title}</span>
            )}
          </div>
          
          {/* 编辑按钮 */}
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveEdit();
                  }}
                  className="p-1 text-green-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                  title="保存"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdit();
                  }}
                  className="p-1 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
                  title="取消"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (card.type === 'chart') {
                    handleOpenFlowchartEditor(card.id);
                  } else {
                    handleStartEdit();
                  }
                }}
                className="p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title={
                  card.type === 'chart' ? '编辑流程图' : '编辑'
                }
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        {/* 正文内容 */}
        <div className="text-sm text-gray-600 mb-3">
          {isEditing ? (
            card.type === 'table' ? (
              <TableEditor
                content={editingProcessedContent}
                onChange={(newContent: string) => setEditingProcessedContent(newContent)}
              />
            ) : card.type === 'formula' ? (
              // 公式卡片编辑时内容不可编辑，只显示
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <div className="font-mono text-sm whitespace-pre-wrap text-orange-900">
                  {card.content}
                </div>
                <div className="text-xs text-orange-600 mt-2 italic">
                  公式内容不可编辑，只能修改标题和标签
                </div>
              </div>
            ) : (
              <textarea
                value={editingProcessedContent}
                onChange={(e) => setEditingProcessedContent(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                onClick={(e) => e.stopPropagation()}
              />
            )
          ) : (
            card.type === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse border border-gray-300">
                  {card.content.split('\n').map((row, index) => (
                    <tr key={index}>
                      {row.split(' | ').map((cell, cellIndex) => (
                        <td key={cellIndex} className="border border-gray-300 px-2 py-1">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </table>
              </div>
            ) : card.type === 'formula' ? (
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <div className="font-mono text-sm whitespace-pre-wrap text-orange-900">
                  {card.content}
                </div>
              </div>
            ) : card.type === 'chart' ? (
              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                <div className="text-sm text-purple-900 mb-2">
                  {card.content}
                </div>
              </div>
            ) : (
              <div className="line-clamp-3">{card.content}</div>
            )
          )}
        </div>

        {/* 标签 - 放到最下面 */}
        <div className="flex flex-wrap gap-1 items-center">
          {isEditing ? (
            <>
              {editingProcessedTags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1 bg-blue-100 rounded-full px-2 py-1">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleUpdateTag(index, e.target.value)}
                    className="text-xs bg-transparent border-none outline-none text-blue-700 w-16"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTag(index);
                    }}
                    className="text-blue-700 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddTag();
                }}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
              >
                + 添加标签
              </button>
            </>
          ) : (
            card.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
              >
                {tag}
              </span>
            ))
          )}
        </div>
      </div>
    );
  };

  // 渲染生成中状态的卡片
  const renderGeneratingCard = () => {
    return (
      <div className="rounded-lg p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-dashed border-orange-400">
        {/* 图标、标题和生成中状态 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-900">AI正在生成...</span>
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4 text-orange-500 animate-spin" />
            <span className="text-xs text-orange-600 font-medium">生成中</span>
          </div>
        </div>

        {/* 生成中的内容占位 */}
        <div className="space-y-2 mb-3">
          <div className="h-3 bg-orange-200 rounded animate-pulse"></div>
          <div className="h-3 bg-orange-200 rounded animate-pulse w-4/5"></div>
          <div className="h-3 bg-orange-200 rounded animate-pulse w-3/5"></div>
        </div>

        {/* 预计完成时间 */}
        <div className="flex items-center gap-2 text-xs text-orange-600">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
          <span>预计1分钟后完成</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
            {/* 顶部标题区域 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/process-step1/1`)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">第二步：AI分析</h1>
              <p className="text-sm text-gray-500">AI进行数据处理</p>
            </div>
          </div>

          {/* 处理进度 - 持续进行 */}
          {!isProcessingCompleted ? (
            <div 
              className="bg-orange-50 border border-orange-200 py-2 px-4 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-orange-100 transition-colors"
              onClick={() => setIsProcessingCompleted(true)}
            >
              <RefreshCw className="h-4 w-4 text-orange-500 animate-spin" />
              <div className="text-sm">
                <div className="text-gray-900 font-medium">
                  AI正在处理中...
                </div>
                <div className="text-gray-500 text-xs">
                  预计剩余 2 分钟
                </div>
              </div>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: '65%' }}
                ></div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleProceedToStep3}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span className="text-sm font-medium">下一步</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* 章节控制区域 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-center">
          {/* 章节导航器 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={goToPrevChapter}
                disabled={currentChapterIndex === 0}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <span className="px-4 py-2 text-base font-semibold text-gray-900 min-w-[120px] text-center">
                {selectedChapter}
              </span>
              <button
                onClick={goToNextChapter}
                disabled={currentChapterIndex >= availableChapters.length - 1}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* 左侧：第一步的粗拆卡片 */}
        <div className="w-1/2 bg-white border-l-4 ">
          <div className="h-full flex flex-col">
            {/* 左侧标题区 */}
            <div className="px-6 py-4 border-b ">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-black">文章分割结果</h2>
                <span className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                   共 {filteredExtractedCards.length} 条
                </span>
              </div>
            </div>
            
            {/* 左侧卡片内容 */}
            <div className="flex-1 overflow-auto p-6 space-y-4 scrollbar-hide">
              {filteredExtractedCards.map(renderExtractedCard)}
            </div>
          </div>
        </div>

        {/* 右侧：AI处理后的卡片 */}
        <div className="w-1/2 bg-white border-l border-gray-200 border-r-4 ">
          <div className="h-full flex flex-col">
            {/* 右侧标题区 */}
            <div className="px-6 py-4 border-b ">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-black">AI分析结果</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                    共 {filteredProcessedCards.length} 条
                  </span>
                </div>
              </div>
            </div>

            {/* 右侧卡片内容 */}
            <div className="flex-1 overflow-auto p-6 scrollbar-hide">
              <div className="space-y-4">
                {filteredProcessedCards.map(renderProcessedCard)}
                {/* 在第三章显示生成中状态的卡片 */}
                {selectedChapter === '第三章 监管要求' && renderGeneratingCard()}
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* 流程图编辑器浮窗 */}
      {showFlowchartEditor && flowchartEditingCardId && (
        <FlowchartEditor
          content={processedCards.find(c => c.id === flowchartEditingCardId)?.content || ''}
          onChange={handleSaveFlowchart}
          onClose={handleCloseFlowchartEditor}
          tags={processedCards.find(c => c.id === flowchartEditingCardId)?.tags || []}
          onTagsChange={handleSaveFlowchartTags}
          title={processedCards.find(c => c.id === flowchartEditingCardId)?.title || ''}
          onTitleChange={handleSaveFlowchartTitle}
          originalImage="/api/placeholder/600/400" // 这里可以传入实际的原始流程图图片URL
        />
      )}
    </div>
  );
};

export default ProcessStep2; 