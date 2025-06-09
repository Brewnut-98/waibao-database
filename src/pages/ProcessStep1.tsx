import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, FileText, Image, RefreshCw, CheckCircle, ChevronLeft, ChevronRight, Link, Unlink, Edit3, Trash2, Save } from 'lucide-react';

interface RawContent {
  id: string;
  type: 'text' | 'image';
  content: string;
  pageNumber: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface ExtractedCard {
  id: string;
  type: 'text' | 'image';
  title: string;
  content: string;
  sourcePageNumber: number;
  sourceChapter: string;
  confidence: number;
}

const ProcessStep1 = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [extractedCards, setExtractedCards] = useState<ExtractedCard[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>('第一章 概述');
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [linkedCards, setLinkedCards] = useState<Set<string>>(new Set());
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  
  // 文档信息
  const documentInfo = {
    fileName: id?.startsWith('doc_') ? '新上传文档.pdf' : '2024年法律合规指南.pdf',
    fileSize: '2.5 MB',
    uploadTime: new Date().toLocaleString('zh-CN'),
    totalPages: 125,
    documentContent: `
企业法律合规指南

第一章 概述

本指南旨在为企业提供全面的法律合规框架，确保业务运营符合相关法律法规要求。在当今复杂的监管环境中，企业需要建立完善的合规体系来识别、评估和管理法律风险。

1.1 合规体系的重要性

法律合规不仅是企业的法定义务，更是企业可持续发展的重要保障。有效的合规体系能够：
• 预防法律风险和监管处罚
• 提升企业治理水平
• 增强投资者和客户信心
• 维护企业声誉和品牌价值

1.2 合规框架构建原则

构建有效的合规框架应当遵循以下基本原则：
• 全面性：覆盖所有业务流程和操作环节
• 系统性：建立完整的制度体系和管理流程
• 动态性：根据法规变化及时更新调整
• 可操作性：制度规定应当具体明确，便于执行

第二章 风险管理

2.1 风险识别与评估

企业应当建立系统性的风险识别机制，定期评估内外部环境变化对业务合规性的影响。

风险类型分类：
1. 监管风险：违反法律法规可能面临的处罚风险
2. 操作风险：内部流程缺陷导致的合规问题
3. 声誉风险：合规事件对企业形象的负面影响

2.2 风险评估矩阵

风险类型 | 发生概率 | 影响程度 | 风险等级
监管风险 | 高 | 严重 | 极高
操作风险 | 中 | 中等 | 中等  
声誉风险 | 低 | 严重 | 中高

2.3 应对策略

针对不同风险等级，企业应当制定相应的应对策略和控制措施。

第三章 监管要求

企业需要严格遵守相关监管机构的要求，包括但不限于证监会、银保监会、央行等部门的规定。定期关注法规更新，及时调整内部制度。

第四章 实施指南

本章提供了合规体系实施的具体步骤和操作要点，帮助企业建立有效的合规管理机制。
    `
  };

  // 初始化提取结果
  useEffect(() => {
    // 直接显示模拟AI提取结果
    const mockExtractedCards: ExtractedCard[] = [
      {
        id: 'card_1',
        type: 'text',
        title: '概述章节内容',
        content: '本指南旨在为企业提供全面的法律合规框架，确保业务运营符合相关法律法规要求。在当今复杂的监管环境中，企业需要建立完善的合规体系来识别、评估和管理法律风险。',
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
        content: '展示企业合规管理的组织架构和各部门职责分工关系',
        sourcePageNumber: 1,
        sourceChapter: '第一章 概述',
        confidence: 0.88
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
        }
    ];
    
    setExtractedCards(mockExtractedCards);
  }, []);

  // 获取所有章节
  const availableChapters = Array.from(new Set(extractedCards.map(card => card.sourceChapter)));
  
  // 过滤当前章节的卡片
  const filteredCards = extractedCards.filter(card => card.sourceChapter === selectedChapter);
  
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

  // 检测相邻的可关联卡片（图片-图片 或 文本-图片）
  const checkAdjacentLinkableCards = (cards: ExtractedCard[], index: number) => {
    if (index >= cards.length - 1) return false;
    const currentCard = cards[index];
    const nextCard = cards[index + 1];
    
    // 支持的关联组合：图片-图片、文本-图片、图片-文本
    return (
      (currentCard.type === 'image' && nextCard.type === 'image') ||
      (currentCard.type === 'text' && nextCard.type === 'image') ||
      (currentCard.type === 'image' && nextCard.type === 'text')
    );
  };

  // 关联/取消关联图片卡片
  const toggleCardLink = (cardId1: string, cardId2: string) => {
    const linkKey = `${cardId1}-${cardId2}`;
    const newLinkedCards = new Set(linkedCards);
    
    if (newLinkedCards.has(linkKey)) {
      newLinkedCards.delete(linkKey);
    } else {
      newLinkedCards.add(linkKey);
    }
    
    setLinkedCards(newLinkedCards);
  };

  // 检查两个卡片是否已关联
  const areCardsLinked = (cardId1: string, cardId2: string) => {
    return linkedCards.has(`${cardId1}-${cardId2}`);
  };

  // 根据卡片类型获取关联按钮文本
  const getRelationshipButtonText = (card1: ExtractedCard, card2: ExtractedCard) => {
    if (card1.type === 'text' && card2.type === 'image') {
      return '关联图片';
    } else if (card1.type === 'image' && card2.type === 'text') {
      return '关联文本';
    } else if (card1.type === 'image' && card2.type === 'image') {
      return '关联图片';
    }
    return '关联内容';
  };

  const handleRetryExtraction = () => {
    // 重新生成提取结果
    setExtractedCards([]);
    // 重新执行提取逻辑，这里可以添加重新提取的逻辑
  };

  const handleProceedToStep2 = () => {
    // 跳转到第二步（写死ID为1）
    navigate(`/process-step2/1`, {
      state: { extractedCards }
    });
  };

  const renderDocumentInfo = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-lg font-medium mb-2">文档预览区域</div>
          <div className="text-sm">文档内容将在此处显示</div>
        </div>
      </div>
    );
  };

  const renderExtractedCard = (card: ExtractedCard, isLinked: boolean = false) => {
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
          const isEditing = editingCardId === card.id;
          return isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full text-sm text-gray-600 border border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="编辑文本内容..."
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
                >
                  取消
                </button>
                <button
                  onClick={handleEdit}
                  className="px-2 py-1 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded"
                >
                  保存
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 line-clamp-3">
              {card.content}
            </p>
          );
        case 'image':
          return (
            <div className="flex items-center justify-center h-20 bg-gray-100 rounded border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Image className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">{card.content}</p>
              </div>
            </div>
          );
      }
    };

          const handleEdit = () => {
        if (editingCardId === card.id) {
          // 保存编辑内容
          setExtractedCards(prev => 
            prev.map(c => 
              c.id === card.id ? { ...c, content: editingContent } : c
            )
          );
          setEditingCardId(null);
          setEditingContent('');
        } else {
          // 开始编辑
          setEditingCardId(card.id);
          setEditingContent(card.content);
        }
      };

      const handleCancelEdit = () => {
        setEditingCardId(null);
        setEditingContent('');
      };

      const handleDelete = () => {
        // 处理删除逻辑
        console.log(`删除卡片: ${card.id}`);
      };

      return (
        <div key={card.id} className={`card p-4 hover:shadow-md transition-shadow ${
          isLinked ? 'ring-2 ring-green-300 bg-green-50' : ''
        }`}>
          {/* 顶部：图标 + 章节标签 + 页面标签 + 操作按钮（右侧） */}
          <div className="flex items-center gap-2 mb-3">
            {getTypeIcon()}
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
              {card.sourceChapter}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              第{card.sourcePageNumber}页
            </span>
            {isLinked && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center gap-1">
                <Link className="h-3 w-3" />
                已关联
              </span>
            )}
            
            {/* 操作按钮区域 */}
            <div className="flex items-center gap-1 ml-auto">
              {card.type === 'text' && (
                <button
                  onClick={handleEdit}
                  className={`p-1 transition-colors rounded ${
                    editingCardId === card.id
                      ? 'text-green-500 hover:text-green-600 hover:bg-green-50'
                      : 'text-blue-500 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  title={editingCardId === card.id ? "保存编辑" : "编辑"}
                >
                  {editingCardId === card.id ? (
                    <Save className="h-4 w-4" />
                  ) : (
                    <Edit3 className="h-4 w-4" />
                  )}
                </button>
              )}
              <button
                onClick={handleDelete}
                className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="删除"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* 内容区域 */}
          {renderContent()}
        
        </div>
      );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/process')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">第一步：文档分割</h1>
              <p className="text-sm text-gray-500">将源文档进行内容拆分</p>
            </div>
          </div>

          {/* 下一步按钮 */}
          {extractedCards.length > 0 && (
            <button
              onClick={handleProceedToStep2}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>下一步</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* 左侧：文档信息 */}
        <div className="w-1/2 p-6 border-r border-gray-200">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">{documentInfo.fileName}</h2>
            </div>
            <div className="flex-1">
              {renderDocumentInfo()}
            </div>
          </div>
        </div>

        {/* 右侧：提取的卡片 */}
        <div className="w-1/2 p-6">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">提取结果</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  已提取 {extractedCards.length} 个卡片
                </span>
              </div>
            </div>
            
            {/* 章节导航器 */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm text-gray-600">章节:</span>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={goToPrevChapter}
                  disabled={currentChapterIndex === 0}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-[80px] text-center">
                  {getCurrentChapterNumber()}
                </span>
                <button
                  onClick={goToNextChapter}
                  disabled={currentChapterIndex >= availableChapters.length - 1}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex-1 space-y-3 overflow-auto scrollbar-hide">
                {filteredCards.slice(0, 4).map((card, index, array) => {
                  const nextCard = array[index + 1];
                  const isCurrentLinked = nextCard && areCardsLinked(card.id, nextCard.id);
                  const isPrevLinked = index > 0 && areCardsLinked(array[index - 1].id, card.id);
                  
                  return (
                    <div key={card.id}>
                      {renderExtractedCard(card, isCurrentLinked || isPrevLinked)}
                      
                      {/* 相邻卡片关联按钮 */}
                      {checkAdjacentLinkableCards(array, index) && (
                        <div className="flex justify-center mt-2 mb-1">
                          <button
                            onClick={() => toggleCardLink(card.id, array[index + 1].id)}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors ${
                              areCardsLinked(card.id, array[index + 1].id)
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {areCardsLinked(card.id, array[index + 1].id) ? (
                              <>
                                <Unlink className="h-3 w-3" />
                                <span>取消关联</span>
                              </>
                            ) : (
                              <>
                                <Link className="h-3 w-3" />
                                <span>{getRelationshipButtonText(card, array[index + 1])}</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessStep1; 