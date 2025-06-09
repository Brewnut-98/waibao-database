import { Fragment, useState, useEffect, useRef } from 'react';
import { Notebook, Layers, Image as ImageIcon, Table, Tag, Check, X, Save, Edit, ChevronDown, ChevronUp } from 'lucide-react';

const documentData = {
  title: '2024年法律合规指南',
  author: '法务部',
  date: '2024-04-10',
  cards: [
    {
      id: 1,
      type: 'text',
      content: `# 监管合规简介

监管合规涉及遵守与业务流程相关的法律、法规、指南和规范。违反合规规定通常会导致法律处罚，包括联邦罚款。

合规成本虽然有时很高，但低于不合规的成本。不合规成本包括业务中断、收入损失、生产力下降和法律费用。`,
      tags: ['简介', '合规', '法规'],
      confidence: 0.95,
    },
    {
      id: 2,
      type: 'table',
      content: [
        ['法规类型', '应用领域', '监管机构'],
        ['GDPR', '数据隐私', '欧盟'],
        ['SOX', '财务报告', '证监会'],
        ['HIPAA', '医疗数据', '卫生部'],
        ['PCI DSS', '支付卡安全', 'PCI安全标准委员会'],
      ],
      tags: ['法规', '合规要求'],
      confidence: 0.88,
    },
    {
      id: 3,
      type: 'text',
      content: `## 主要合规领域

组织必须关注几个关键的监管合规领域：

1. **数据隐私和保护**：确保客户和员工数据根据相关法规得到适当的保护和管理。

2. **财务报告**：按照会计准则维护准确的财务记录和报告。

3. **环境合规**：遵守旨在保护环境免受危害的法律。

4. **工作场所安全**：遵守旨在确保员工工作场所安全的法规。`,
      tags: ['关键领域', '数据隐私', '财务', '环境', '安全'],
      confidence: 0.92,
    },
    {
      id: 4,
      type: 'image',
      content: 'https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      caption: '图1：监管合规框架概述',
      tags: ['框架', '图表', '概述'],
      confidence: 0.85,
    },
  ],
};

interface DocumentPreviewProps {
  processingState: 'idle' | 'uploading' | 'processing' | 'validating' | 'complete';
  filename: string;
}

const DocumentPreview = ({ processingState, filename }: DocumentPreviewProps) => {
  const [activeCard, setActiveCard] = useState(1);
  const [editingTags, setEditingTags] = useState(false);
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [processedCards, setProcessedCards] = useState<number[]>([]);

  useEffect(() => {
    if (processingState === 'processing') {
      const interval = setInterval(() => {
        setProcessedCards(prev => {
          if (prev.length < documentData.cards.length) {
            return [...prev, prev.length + 1];
          }
          clearInterval(interval);
          return prev;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [processingState]);

  if (processingState === 'idle') {
    return (
      <div className="card h-[calc(100vh-16rem)] flex flex-col items-center justify-center p-12 text-center">
        <Notebook className="h-16 w-16 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">暂无文档预览</h3>
        <p className="mt-1 text-gray-500">
          上传文档以查看处理预览
        </p>
      </div>
    );
  }

  if (processingState === 'uploading' || processingState === 'processing') {
    return (
      <div className="card h-[calc(100vh-16rem)]">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h3 className="font-medium text-gray-900">{filename || '文档处理中'}</h3>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="ml-2 text-sm text-gray-500">
              {processingState === 'uploading' ? '正在上传...' : '正在处理...'}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="text-sm text-gray-700">当前进度</div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div 
              className="h-2 animate-pulse rounded-full bg-blue-500"
              style={{ width: `${(processedCards.length / documentData.cards.length) * 100}%` }}
            ></div>
          </div>

          <div className="text-sm text-gray-700">处理步骤</div>
          <div className="space-y-3">
            {documentData.cards.map((card, index) => {
              const isProcessed = processedCards.includes(index + 1);
              const isProcessing = processedCards.length === index;
              
              return (
                <div key={index} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`rounded-full p-2 ${
                        isProcessed ? 'bg-green-100' : 
                        isProcessing ? 'bg-blue-100' : 
                        'bg-gray-100'
                      }`}>
                        {isProcessed ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : isProcessing ? (
                          <div className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        段落 {index + 1}
                        {isProcessed ? ' - 已完成' : 
                         isProcessing ? ' - 处理中' : 
                         ' - 等待处理'}
                      </span>
                    </div>
                    {isProcessed && (
                      <span className="text-xs text-gray-500">100%</span>
                    )}
                    {isProcessing && (
                      <span className="text-xs text-gray-500">处理中...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">已处理段落</p>
                <p className="text-sm font-medium text-gray-900">
                  {processedCards.length} / {documentData.cards.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">预计剩余时间</p>
                <p className="text-sm font-medium text-gray-900">
                  {Math.max(2, 5 - processedCards.length)}分钟
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const card = documentData.cards[activeCard - 1];
  if (processingState === 'validating' && card) {
    if (currentTags.length === 0 && card.tags) {
      setCurrentTags([...card.tags]);
    }
  }

  const renderCardContent = (card: typeof documentData.cards[0]) => {
    if (card.type === 'text') {
      return (
        <div className="prose prose-sm max-w-none">
          {card.content}
        </div>
      );
    } else if (card.type === 'table') {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {card.content[0].map((header, idx) => (
                  <th 
                    key={idx}
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-50"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {card.content.slice(1).map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, cellIdx) => (
                    <td 
                      key={cellIdx}
                      className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (card.type === 'image') {
      return (
        <div className="text-center">
          <img 
            src={card.content} 
            alt={card.caption || '文档图片'} 
            className="mx-auto max-h-64 rounded-md"
          />
          {card.caption && (
            <p className="mt-2 text-sm text-gray-500 italic">{card.caption}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card h-[calc(100vh-16rem)] overflow-y-auto">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h3 className="font-medium text-gray-900">{documentData.title}</h3>
        <div className="flex items-center">
          <div 
            className={`h-2 w-2 rounded-full ${
              processingState === 'validating' ? 'bg-yellow-500' : 'bg-green-500'
            }`}
          ></div>
          <span className="ml-2 text-sm text-gray-500">
            {processingState === 'validating' ? '需要验证' : '处理完成'}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <Layers className="h-5 w-5 text-gray-400" />
          <span className="ml-2 text-sm text-gray-700">
            段落 {activeCard} / {documentData.cards.length}
          </span>
        </div>
        <div className="flex space-x-1">
          {documentData.cards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCard(idx + 1)}
              className={`h-2 w-2 rounded-full transition-colors ${
                activeCard === idx + 1
                  ? 'bg-primary-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            ></button>
          ))}
        </div>
      </div>

      {card && (
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <div 
              className={`rounded-full p-1 ${
                card.type === 'text' 
                  ? 'bg-blue-100 text-blue-700' 
                  : card.type === 'table'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              {card.type === 'text' && <Notebook className="h-4 w-4" />}
              {card.type === 'table' && <Table className="h-4 w-4" />}
              {card.type === 'image' && <ImageIcon className="h-4 w-4" />}
            </div>
            <span className="ml-2 text-sm font-medium capitalize">
              {card.type === 'text' ? '文本段落' : 
               card.type === 'table' ? '表格段落' : 
               '图片段落'}
            </span>
            
            <div className="ml-auto flex items-center space-x-2 text-sm">
            </div>
          </div>

          <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4">
            {renderCardContent(card)}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">标签</h4>
              {!editingTags && (
                <button
                  onClick={() => setEditingTags(true)}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  <Edit className="h-3 w-3 inline mr-1" />
                  编辑
                </button>
              )}
              {editingTags && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingTags(false);
                      setCurrentTags(card.tags || []);
                    }}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3 inline mr-1" />
                    取消
                  </button>
                  <button
                    onClick={() => setEditingTags(false)}
                    className="text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    <Check className="h-3 w-3 inline mr-1" />
                    保存
                  </button>
                </div>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {currentTags.map((tag, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                  {editingTags && (
                    <button
                      onClick={() => {
                        setCurrentTags((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
              
              {editingTags && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newTag.trim()) {
                      setCurrentTags((prev) => [...prev, newTag.trim()]);
                      setNewTag('');
                    }
                  }}
                  className="inline-flex items-center"
                >
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="添加标签..."
                    className="w-24 rounded-md border border-gray-300 py-0.5 px-2 text-xs focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    className="ml-1 rounded-md bg-primary-50 p-1 text-primary-600 hover:bg-primary-100"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              disabled={activeCard === 1}
              onClick={() => setActiveCard((prev) => Math.max(1, prev - 1))}
              className="btn-outline py-1 px-3 disabled:opacity-50"
            >
              上一个
            </button>
            
            {activeCard < documentData.cards.length ? (
              <button
                onClick={() => setActiveCard((prev) => Math.min(documentData.cards.length, prev + 1))}
                className="btn-primary py-1 px-3"
              >
                下一个
              </button>
            ) : (
              <button className="btn-primary py-1 px-3">
                <Save className="mr-2 h-4 w-4" />
                保存全部
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Plus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

export default DocumentPreview;