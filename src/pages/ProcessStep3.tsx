import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Filter, ChevronDown, MessageSquare, Brain, RotateCcw, FileText, Table, BarChart3, Tag, Edit3, Save, Trash2 } from 'lucide-react';

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

interface QuestionTemplate {
  id: string;
  question: string;
  category: string;
  industry: string[];
  documentTypes: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

interface QuestionAnswer {
  id: string;
  questionId: string;
  answer: string;
  confidence: number;
  sources: string[];
  reasoning: string;
  status: 'pending' | 'approved' | 'rejected';
  userFeedback?: string;
}

const ProcessStep3 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 状态管理
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedDocType, setSelectedDocType] = useState<string>('all');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [isGeneratingAnswers, setIsGeneratingAnswers] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentGeneratingIndex, setCurrentGeneratingIndex] = useState<number>(-1);
  const [currentViewingQuestionIndex, setCurrentViewingQuestionIndex] = useState<number>(0);
  const [questionsStarted, setQuestionsStarted] = useState<boolean>(false);

  // 编辑相关状态（与step2保持一致）
  const [selectedProcessedCard, setSelectedProcessedCard] = useState<string>('');
  const [editingProcessedCardId, setEditingProcessedCardId] = useState<string | null>(null);
  const [editingProcessedTitle, setEditingProcessedTitle] = useState<string>('');
  const [editingProcessedContent, setEditingProcessedContent] = useState<string>('');
  const [editingProcessedTags, setEditingProcessedTags] = useState<string[]>([]);

  // 从第二步传递过来的数据
  const processedCards: ProcessedCard[] = location.state?.processedCards || [];

  // 键盘导航支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!questionsStarted || selectedQuestions.length === 0) return;

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        setCurrentViewingQuestionIndex(prev => Math.max(0, prev - 1));
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        setCurrentViewingQuestionIndex(prev => Math.min(selectedQuestions.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [questionsStarted, selectedQuestions.length]);

  // 模拟问题模板数据
  const questionTemplates: QuestionTemplate[] = [
    {
      id: 'q1',
      question: '这份文档的主要目的和核心内容是什么？',
      category: '问题1',
      industry: ['all', 'finance', 'legal', 'medical'],
      documentTypes: ['all', 'report', 'contract', 'manual'],
      difficulty: 'easy',
      tags: ['概述', '主旨']
    },
    {
      id: 'q2',
      question: '文档中提到的关键数据和指标有哪些？请列出具体数值。',
      category: '问题2',
      industry: ['all', 'finance', 'research'],
      documentTypes: ['all', 'report', 'analysis'],
      difficulty: 'medium',
      tags: ['数据', '指标', '统计']
    },
    {
      id: 'q3',
      question: '文档中是否存在逻辑矛盾或数据不一致的地方？',
      category: '问题3',
      industry: ['all', 'finance', 'legal', 'research'],
      documentTypes: ['all', 'report', 'contract', 'analysis'],
      difficulty: 'hard',
      tags: ['逻辑', '一致性', '质量']
    },
    {
      id: 'q4',
      question: '文档中的重要时间节点和截止日期有哪些？',
      category: '问题4',
      industry: ['all', 'legal', 'project'],
      documentTypes: ['all', 'contract', 'schedule', 'plan'],
      difficulty: 'easy',
      tags: ['时间', '日期', '截止']
    },
    {
      id: 'q5',
      question: '文档中涉及的风险因素和注意事项有哪些？',
      category: '问题5',
      industry: ['all', 'finance', 'legal', 'medical'],
      documentTypes: ['all', 'report', 'contract', 'manual'],
      difficulty: 'medium',
      tags: ['风险', '注意事项', '警告']
    },
    {
      id: 'q6',
      question: '文档的结论和建议是否有充分的依据支撑？',
      category: '问题6',
      industry: ['all', 'research', 'consulting'],
      documentTypes: ['all', 'report', 'analysis', 'proposal'],
      difficulty: 'hard',
      tags: ['结论', '建议', '依据']
    }
  ];

  // 行业和文档类型选项
  const industries = [
    { value: 'all', label: '全部行业' },
    { value: 'finance', label: '金融' },
    { value: 'legal', label: '法律' },
    { value: 'medical', label: '医疗' },
    { value: 'research', label: '研究' },
    { value: 'consulting', label: '咨询' },
    { value: 'project', label: '项目管理' }
  ];

  const documentTypes = [
    { value: 'all', label: '全部类型' },
    { value: 'report', label: '报告' },
    { value: 'contract', label: '合同' },
    { value: 'manual', label: '手册' },
    { value: 'analysis', label: '分析' },
    { value: 'schedule', label: '计划' },
    { value: 'proposal', label: '提案' }
  ];

  // 筛选问题模板
  const getFilteredQuestions = () => {
    return questionTemplates.filter(q => {
      const industryMatch = selectedIndustry === 'all' || q.industry.includes(selectedIndustry);
      const docTypeMatch = selectedDocType === 'all' || q.documentTypes.includes(selectedDocType);
      return industryMatch && docTypeMatch;
    });
  };

  // 选择问题
  const handleQuestionSelect = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(prev => prev.filter(id => id !== questionId));
    } else {
      setSelectedQuestions(prev => [...prev, questionId]);
    }
  };

  // 自动生成所有答案
  const generateAllAnswers = async () => {
    setIsGeneratingAnswers(true);

    for (let i = 0; i < selectedQuestions.length; i++) {
      const questionId = selectedQuestions[i];
      setCurrentGeneratingIndex(i);

      // 模拟AI生成答案的过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      const question = questionTemplates.find(q => q.id === questionId);
      if (!question) continue;

      // 模拟生成的答案
      const mockAnswer: QuestionAnswer = {
        id: `answer_${questionId}_${Date.now()}`,
        questionId,
        answer: generateMockAnswer(question),
        confidence: 0.85 + Math.random() * 0.1,
        sources: [`页面 ${Math.floor(Math.random() * 10) + 1}`, `页面 ${Math.floor(Math.random() * 10) + 1}`],
        reasoning: '基于文档内容分析，结合上下文语义理解得出此结论。',
        status: 'pending'
      };

      setAnswers(prev => [...prev, mockAnswer]);
    }

    setCurrentGeneratingIndex(-1);
    setIsGeneratingAnswers(false);
  };

  // 生成模拟答案
  const generateMockAnswer = (question: QuestionTemplate): string => {
    const mockAnswers: { [key: string]: string } = {
      'q1': '这份文档主要是一份企业年度财务报告，核心内容包括：1）公司2023年度经营业绩总结；2）财务状况分析；3）风险因素披露；4）未来发展战略规划。文档旨在向股东和投资者全面展示公司的经营状况和发展前景。',
      'q2': '文档中的关键数据包括：营业收入125.6亿元（同比增长15.2%）；净利润18.9亿元（同比增长22.1%）；总资产456.7亿元；净资产收益率12.8%；现金流量净额32.4亿元。',
      'q3': '经过仔细检查，文档在数据一致性方面存在以下问题：第15页提到的市场份额为23.5%，但第42页图表显示为24.1%；另外，第三季度收入数据在不同章节中存在0.3%的差异。',
      'q4': '重要时间节点包括：年度股东大会（2024年4月15日）；中期业绩发布（2024年8月30日）；债券到期日（2025年12月31日）；新产品发布计划（2024年第二季度）。',
      'q5': '主要风险因素包括：1）市场竞争加剧风险；2）原材料价格波动风险；3）汇率变动风险；4）政策法规变化风险；5）技术更新迭代风险。建议加强风险管控和预警机制。',
      'q6': '文档的结论和建议具有较强的数据支撑。营收增长结论基于详细的分季度数据分析；市场扩张建议有充分的市场调研数据支持；但在新技术投资建议方面，缺乏具体的投资回报率分析。'
    };

    return mockAnswers[question.id] || '基于文档内容分析，暂时无法提供具体答案，建议进一步核实相关信息。';
  };



  // 获取问题的答案
  const getAnswerForQuestion = (questionId: string) => {
    return answers.find(a => a.questionId === questionId);
  };

  // 检查是否所有问题都已回答
  const allQuestionsAnswered = () => {
    return selectedQuestions.every(qId => answers.some(a => a.questionId === qId));
  };

  // 完成验证
  const handleCompleteValidation = () => {
    const totalCount = answers.length;

    navigate('/my-workspace/process', {
      state: {
        message: `问题验证完成！共回答 ${totalCount} 个问题。`,
        processedCards,
        answers
      }
    });
  };

  // 渲染问题选择卡片（简化版）
  const renderQuestionCard = (question: QuestionTemplate) => {
    const isSelected = selectedQuestions.includes(question.id);

    return (
      <div
        key={question.id}
        className={`border rounded-lg p-3 cursor-pointer transition-all ${
          isSelected
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleQuestionSelect(question.id)}
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-900 flex-1">{question.question}</span>
        </div>
      </div>
    );
  };

  // 渲染参考卡片（与step2格式完全一致）
  const renderReferenceCard = (card: ProcessedCard) => {
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
      // 在step3中，我们不需要实际保存，只是模拟编辑状态
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
        onClick={() => {
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
                  handleStartEdit();
                }}
                className="p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="编辑"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* 正文内容 */}
        <div className="text-sm text-gray-600 mb-3">
          {isEditing ? (
            <textarea
              value={editingProcessedContent}
              onChange={(e) => setEditingProcessedContent(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              onClick={(e) => e.stopPropagation()}
            />
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

  // 渲染答案卡片（简化版）
  const renderAnswerCard = (answer: QuestionAnswer) => {
    const question = questionTemplates.find(q => q.id === answer.questionId);
    if (!question) return null;

    return (
      <div key={answer.id} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-purple-500" />
          <span className="text-sm font-medium text-gray-900">AI 回答</span>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-700 leading-relaxed">{answer.answer}</div>
        </div>

        {answer.sources.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-700 mb-1">信息来源：</div>
            <div className="flex flex-wrap gap-1">
              {answer.sources.map((source, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="text-xs font-medium text-gray-700 mb-1">推理过程：</div>
          <div className="text-xs text-gray-600">{answer.reasoning}</div>
        </div>
      </div>
    );
  };

  // 获取当前查看的问题
  const getCurrentViewingQuestion = () => {
    if (selectedQuestions.length === 0) return null;
    return questionTemplates.find(q => q.id === selectedQuestions[currentViewingQuestionIndex]);
  };

  // 获取当前查看问题的答案
  const getCurrentViewingAnswer = () => {
    const currentQuestion = getCurrentViewingQuestion();
    if (!currentQuestion) return null;
    return answers.find(a => a.questionId === currentQuestion.id);
  };

  // 开始问题验证
  const startQuestionValidation = () => {
    setQuestionsStarted(true);
    setCurrentViewingQuestionIndex(0);
    generateAllAnswers();
  };

  const filteredQuestions = getFilteredQuestions();
  const canComplete = allQuestionsAnswered() && selectedQuestions.length > 0;
  const currentViewingQuestion = getCurrentViewingQuestion();
  const currentViewingAnswer = getCurrentViewingAnswer();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/process-step2/1`)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">第三步：文档验证</h1>
              <p className="text-sm text-gray-500">通过提问验证文档的严谨性和准确性</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!questionsStarted ? (
              <button
                onClick={startQuestionValidation}
                disabled={selectedQuestions.length === 0}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                开始验证 ({selectedQuestions.length})
              </button>
            ) : (
              <button
                onClick={handleCompleteValidation}
                disabled={!canComplete}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  canComplete
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                完成验证
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容区域 - 左右分栏布局 */}
      <div className="flex-1 flex">
        {/* 左侧：参考卡片区域 */}
        <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">参考文档卡片</h3>
            <p className="text-sm text-gray-500">
              {questionsStarted
                ? `${processedCards.length} 个卡片 ${!isGeneratingAnswers ? '(可编辑)' : ''}`
                : '选择问题后将显示相关卡片'
              }
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {questionsStarted ? (
              <div className="p-4">
                <div className="grid grid-cols-1 gap-4">
                  {processedCards.map(renderReferenceCard)}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">等待问题选择</p>
                  <p className="text-sm">选择验证问题后，相关的文档卡片将在此显示</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：问题选择和回答区域 */}
        <div className="w-1/2 bg-gray-50 flex flex-col">
          {!questionsStarted ? (
            // 问题选择阶段
            <>
              {/* 筛选面板 */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">选择验证问题</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Filter className="h-4 w-4" />
                    筛选条件
                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">行业类型</label>
                      <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {industries.map(industry => (
                          <option key={industry.value} value={industry.value}>
                            {industry.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">文档类型</label>
                      <select
                        value={selectedDocType}
                        onChange={(e) => setSelectedDocType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {documentTypes.map(docType => (
                          <option key={docType.value} value={docType.value}>
                            {docType.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  已选择 {selectedQuestions.length} 个问题，共 {filteredQuestions.length} 个可选问题
                </div>
              </div>

              {/* 问题列表 */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-4">
                  {filteredQuestions.map(renderQuestionCard)}
                </div>
              </div>
            </>
          ) : (
            // 问题回答阶段
            <>
              {/* 进度面板 */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">AI 自动回答进度</h3>
                    <p className="text-sm text-gray-500">
                      {isGeneratingAnswers
                        ? `正在生成问题${currentGeneratingIndex + 1} / 共${selectedQuestions.length}个问题...`
                        : `已完成 ${answers.length} / ${selectedQuestions.length} 个问题`
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                  </div>
                </div>

                {/* 进度条 */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${isGeneratingAnswers
                        ? ((currentGeneratingIndex + 1) / selectedQuestions.length) * 100
                        : (answers.length / selectedQuestions.length) * 100
                      }%`
                    }}
                  ></div>
                </div>

                {/* 问题导航 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {selectedQuestions.map((questionId, index) => {
                      const answer = getAnswerForQuestion(questionId);
                      const isCurrentlyGenerating = isGeneratingAnswers && currentGeneratingIndex === index;
                      const isActive = currentViewingQuestionIndex === index;

                      return (
                        <button
                          key={questionId}
                          onClick={() => setCurrentViewingQuestionIndex(index)}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : isCurrentlyGenerating
                              ? 'bg-yellow-100 text-yellow-700'
                              : answer
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          问题{index + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* 上下问题导航按钮 */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentViewingQuestionIndex(Math.max(0, currentViewingQuestionIndex - 1))}
                      disabled={currentViewingQuestionIndex === 0}
                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="上一题 (←键)"
                    >
                      上一题
                    </button>
                    <button
                      onClick={() => setCurrentViewingQuestionIndex(Math.min(selectedQuestions.length - 1, currentViewingQuestionIndex + 1))}
                      disabled={currentViewingQuestionIndex === selectedQuestions.length - 1}
                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="下一题 (→键)"
                    >
                      下一题
                    </button>
                    <span className="text-xs text-gray-400 ml-2">可用方向键切换</span>
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">总问题：</span>
                    <span className="font-medium">{selectedQuestions.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">已回答：</span>
                    <span className="font-medium text-purple-600">{answers.length}</span>
                  </div>
                </div>
              </div>

              {/* 当前问题显示区域 */}
              <div className="flex-1 overflow-y-auto">
                {currentViewingQuestion ? (
                  <div className="p-6">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      {/* 问题标题 */}
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                            {currentViewingQuestionIndex + 1}
                          </span>
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                          <h3 className="text-lg font-medium text-gray-900">问题{currentViewingQuestionIndex + 1}</h3>
                        </div>
                        <p className="text-sm text-gray-700 ml-11">{currentViewingQuestion.question}</p>
                      </div>

                      {/* AI回答区域 */}
                      <div className="p-6">
                        {isGeneratingAnswers && currentGeneratingIndex === currentViewingQuestionIndex ? (
                          <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                              <RotateCcw className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
                              <p className="text-gray-600 mb-2">AI 正在分析文档内容...</p>
                              <p className="text-sm text-gray-500">基于参考卡片生成回答</p>
                            </div>
                          </div>
                        ) : currentViewingAnswer ? (
                          renderAnswerCard(currentViewingAnswer)
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <Brain className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-2">等待 AI 回答</p>
                            <p className="text-xs text-gray-400">AI 将自动基于参考卡片内容回答此问题</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">选择问题查看</p>
                      <p className="text-sm">点击上方问题标签查看AI回答</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessStep3; 