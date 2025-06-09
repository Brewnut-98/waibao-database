import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown, FileText, Type, Table, Image, Tag, Plus, X, Save, Check } from 'lucide-react';

interface ContentCard {
  id: string;
  type: 'text' | 'table' | 'image';
  title: string; // AI总结内容
  content: string;
  page?: number;
  section?: string; // 所属段落，如"第一章第二节"
  tags?: string[];
}

interface ValidationData {
  id: string;
  title: string;
  size: string;
  uploadedAt: string;
  extractedContent: ContentCard[];
}

const DocumentValidation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);

  // 模拟数据 - 实际项目中从API获取
  const [validationData, setValidationData] = useState<ValidationData>({
    id: id || '1',
    title: '2024年法律合规指南.pdf',
    size: '2.5 MB',
    uploadedAt: '2024-04-10 14:30',
    extractedContent: [
      {
        id: 'content_1',
        type: 'text',
        title: '介绍企业法律合规框架的重要性和构建原则',
        content: '本指南旨在为企业提供全面的法律合规框架，确保业务运营符合相关法律法规要求。在当今复杂的监管环境中，企业需要建立完善的合规体系来识别、评估和管理法律风险...',
        page: 1,
        section: '第一章',
        tags: ['法律合规', '风险管理', '企业制度']
      },
      {
        id: 'content_2',
        type: 'table',
        title: '各部门合规检查任务分工及时间安排表',
        content: '序号 | 检查项目 | 负责部门 | 完成时间\n1 | 数据保护合规 | IT部门 | 2024-03-01\n2 | 财务报告合规 | 财务部门 | 2024-03-15\n3 | 劳动法合规 | 人事部门 | 2024-03-30',
        page: 3,
        section: '第一章第二节',
        tags: ['检查清单', '部门职责', '时间规划']
      },
      {
        id: 'content_3',
        type: 'image',
        title: '展示合规管理组织架构和部门职责分工',
        content: '组织架构图显示了合规管理的层级结构和各部门职责分工',
        page: 5,
        section: '第一章第三节',
        tags: ['流程图', '组织架构', '职责分工']
      },
      {
        id: 'content_4',
        type: 'text',
        title: '阐述风险管理机制和主要风险类别识别',
        content: '风险管理是合规体系的核心组成部分。企业应当建立系统性的风险识别机制，定期评估内外部环境变化对业务合规性的影响。主要风险类别包括：监管风险、操作风险、声誉风险等...',
        page: 8,
        section: '第二章 风险管理',
        tags: ['风险管理', '识别机制', '影响评估']
      }
    ]
  });

  const currentCard = validationData.extractedContent[currentCardIndex];

  // 更新当前卡片
  const updateCurrentCard = (updates: Partial<ContentCard>) => {
    setValidationData(prev => ({
      ...prev,
      extractedContent: prev.extractedContent.map((card, index) =>
        index === currentCardIndex ? { ...card, ...updates } : card
      )
    }));
  };

  // 切换到上一个卡片
  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsEditing(false);
    }
  };

  // 切换到下一个卡片
  const goToNextCard = () => {
    if (currentCardIndex < validationData.extractedContent.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsEditing(false);
    }
  };

  // 添加标签
  const addTag = () => {
    if (newTag.trim() && currentCard.tags) {
      const updatedTags = [...currentCard.tags, newTag.trim()];
      updateCurrentCard({ tags: updatedTags });
      setNewTag('');
      setShowAddTag(false);
    }
  };

  // 删除标签
  const removeTag = (tagIndex: number) => {
    if (currentCard.tags) {
      const updatedTags = currentCard.tags.filter((_, index) => index !== tagIndex);
      updateCurrentCard({ tags: updatedTags });
    }
  };

  // 保存并完成验证
  const completeValidation = () => {
    // 这里应该调用API保存验证结果
    alert('验证完成！所有修改已保存。');
    navigate('/my-workspace/process');
  };

  const getTypeIcon = () => {
    switch (currentCard.type) {
      case 'text':
        return <Type className="h-5 w-5 text-blue-500" />;
      case 'table':
        return <Table className="h-5 w-5 text-green-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-purple-500" />;
    }
  };

  const renderEditableContent = () => {
    if (!isEditing) {
      // 显示模式
      switch (currentCard.type) {
        case 'text':
          return (
            <div className="p-4 bg-gray-50 rounded border min-h-[200px]">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {currentCard.content}
              </p>
            </div>
          );
        case 'table':
          const rows = currentCard.content.split('\n');
          return (
            <div className="p-4 bg-gray-50 rounded border">
              <table className="min-w-full text-sm">
                <tbody className="divide-y divide-gray-200">
                  {rows.map((row, index) => (
                    <tr key={index} className={index === 0 ? 'bg-gray-100 font-medium' : ''}>
                      {row.split(' | ').map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 text-gray-700 border-r border-gray-200 last:border-r-0">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        case 'image':
          return (
            <div className="p-8 bg-gray-50 rounded border min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">{currentCard.content}</p>
                <p className="text-xs text-gray-500 mt-2">图片内容无法编辑</p>
              </div>
            </div>
          );
      }
    } else {
      // 编辑模式
      if (currentCard.type === 'image') {
        return renderEditableContent(); // 图片不可编辑，返回显示模式
      }

      return (
        <div className="p-4 bg-white rounded border">
          <textarea
            value={currentCard.content}
            onChange={(e) => updateCurrentCard({ content: e.target.value })}
            className="w-full h-64 p-3 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder={currentCard.type === 'table' ? '请使用 " | " 分隔列，换行分隔行' : '请输入文本内容...'}
          />
        </div>
      );
    }
  };

  return (
    <div className="animate-fade-in h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <button
                      onClick={() => navigate('/my-workspace/process')}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">返回</span>
        </button>
        
        <h1 className="text-lg font-semibold text-gray-900">
          文档验证 - {validationData.title}
        </h1>
        
        <button
                      onClick={() => navigate(`/my-workspace/data-check/${id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          <Check className="h-4 w-4" />
          数据反查
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Document Preview */}
        <div className="w-1/2 border-r border-gray-200 bg-white flex items-center justify-center">
          <div className="text-center">
            <span className="text-gray-500">上传文档的预览区域</span>
          </div>
        </div>

        {/* Right: Card Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Card Navigation */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getTypeIcon()}
                <span className="text-sm font-medium text-gray-900">
                  卡片 {currentCardIndex + 1} / {validationData.extractedContent.length}
                </span>
                {currentCard.section && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {currentCard.section}
                  </span>
                )}
                <span className="text-xs text-gray-500">第{currentCard.page}页</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousCard}
                  disabled={currentCardIndex === 0}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNextCard}
                  disabled={currentCardIndex === validationData.extractedContent.length - 1}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* AI Summary Title Editor */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">段落总结
              </label>
              <input
                type="text"
                value={currentCard.title}
                onChange={(e) => updateCurrentCard({ title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入AI总结..."
              />
            </div>

            {/* Tags Editor */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">标签</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {currentCard.tags?.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag}
                    <button
                      onClick={() => removeTag(index)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {showAddTag ? (
                  <div className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                      placeholder="新标签"
                      autoFocus
                    />
                    <button
                      onClick={addTag}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => {
                        setShowAddTag(false);
                        setNewTag('');
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddTag(true)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 border border-dashed border-gray-300 rounded-full hover:border-gray-400 hover:text-gray-700"
                  >
                    <Plus className="h-2.5 w-2.5" />
                    添加标签
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                {currentCard.type === 'text' ? '文本内容' : 
                 currentCard.type === 'table' ? '表格数据' : '图片描述'}
              </label>
              {currentCard.type !== 'image' && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-3 w-3" />
                      保存
                    </>
                  ) : (
                    '编辑'
                  )}
                </button>
              )}
            </div>
            
            {renderEditableContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentValidation; 