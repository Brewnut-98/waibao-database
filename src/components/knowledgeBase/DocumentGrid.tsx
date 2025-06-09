import { File, FileSpreadsheet, FileText, Image, Share2, Clock, CheckCircle, AlertCircle, XCircle, Scissors, MoreVertical, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface DocumentGridProps {
  activeDatabase: 'public' | 'shared' | 'private';
  searchQuery: string;
  onShare?: (documentId: string) => void;
  onDelete?: (documentId: string) => void;
  filter?: 'all' | 'shared' | 'unshared' | 'text_splitting' | 'processing' | 'pending_validation' | 'completed' | 'failed';
  hideShareFeatures?: boolean;
}

const DocumentGrid = ({ activeDatabase, searchQuery, onShare, onDelete, filter = 'all', hideShareFeatures = false }: DocumentGridProps) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);
  const getDocumentsForDatabase = (type: 'public' | 'shared' | 'private') => {
    if (type === 'public') {
      return [
        {
          id: '1',
          title: '2024年法律合规指南',
          type: 'pdf',
          date: '2024-04-10',
          category: '法律文档',
          cards: 42,
          tables: 5,
          images: 3,
        },
        // ... other public documents
      ];
    } else if (type === 'shared') {
      return [
        {
          id: '7',
          title: '项目木星规划文档',
          type: 'docx',
          date: '2024-04-08',
          category: '项目文档',
          cards: 56,
          tables: 7,
          images: 2,
        },
        // ... other shared documents
      ];
    } else {
      return [
        {
          id: '11',
          title: '个人研究笔记 - AI趋势与发展方向的深度分析报告',
          type: 'docx',
          date: '2024-04-12',
          cards: 28,
          tables: 3,
          images: 0,
          isShared: true,
          processingStatus: 'completed' as const
        },
        {
          id: '12',
          title: '会议笔记 - 2024技术峰会重点内容总结与行业发展趋势分析',
          type: 'pdf',
          date: '2024-04-05',
          cards: 34,
          tables: 1,
          images: 6,
          isShared: false,
          processingStatus: 'pending_validation' as const
        },
        {
          id: '13',
          title: '提案草稿 - 新产品线规划与市场调研报告',
          type: 'docx',
          date: '2024-03-28',
          cards: 23,
          tables: 5,
          images: 2,
          isShared: false,
          processingStatus: 'processing' as const
        },
        {
          id: '14',
          title: '技术规范文档 - 系统架构设计与实现指南',
          type: 'pdf',
          date: '2024-04-15',
          cards: 0,
          tables: 0,
          images: 0,
          isShared: false,
          processingStatus: 'text_splitting' as const
        },
        {
          id: '15',
          title: '项目计划书 - 2024年度产品路线图',
          type: 'docx',
          date: '2024-04-10',
          cards: 0,
          tables: 0,
          images: 0,
          isShared: false,
          processingStatus: 'failed' as const
        }
      ];
    }
  };

  const documents = getDocumentsForDatabase(activeDatabase).filter(doc => {
    const matchesSearch = !searchQuery || doc.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeDatabase === 'private' && filter !== 'all') {
      // 处理共享状态筛选
      if (filter === 'shared' || filter === 'unshared') {
        const isShared = 'isShared' in doc && doc.isShared;
        return matchesSearch && (
          (filter === 'shared' && isShared) ||
          (filter === 'unshared' && !isShared)
        );
      }

      // 处理处理状态筛选
      if (['text_splitting', 'processing', 'pending_validation', 'completed', 'failed'].includes(filter)) {
        const docStatus = 'processingStatus' in doc ? doc.processingStatus : 'completed';
        return matchesSearch && docStatus === filter;
      }
    }

    return matchesSearch;
  });

  const getIconForDocType = (type: string) => {
    switch (type) {
      case 'xlsx':
        return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
      case 'pdf':
        return <FileText className="h-10 w-10 text-red-500" />;
      case 'pptx':
        return <File className="h-10 w-10 text-orange-500" />;
      case 'docx':
      default:
        return <FileText className="h-10 w-10 text-blue-500" />;
    }
  };

  const getProcessingStatusInfo = (status: string) => {
    switch (status) {
      case 'text_splitting':
        return {
          label: '文本分割',
          icon: <Scissors className="h-3 w-3" />,
          className: 'text-blue-700 bg-blue-100',
          description: '正在进行文本分割处理'
        };
      case 'processing':
        return {
          label: '处理中',
          icon: <Clock className="h-3 w-3" />,
          className: 'text-yellow-700 bg-yellow-100',
          description: '正在进行AI处理分析'
        };
      case 'pending_validation':
        return {
          label: '待验证',
          icon: <AlertCircle className="h-3 w-3" />,
          className: 'text-orange-700 bg-orange-100',
          description: '等待用户验证确认'
        };
      case 'completed':
        return {
          label: '已完成',
          icon: <CheckCircle className="h-3 w-3" />,
          className: 'text-green-700 bg-green-100',
          description: '处理完成，可以使用'
        };
      case 'failed':
        return {
          label: '处理失败',
          icon: <XCircle className="h-3 w-3" />,
          className: 'text-red-700 bg-red-100',
          description: '处理过程中出现错误'
        };
      default:
        return {
          label: '未知状态',
          icon: <AlertCircle className="h-3 w-3" />,
          className: 'text-gray-700 bg-gray-100',
          description: '状态未知'
        };
    }
  };

  return (
    <div>
      {searchQuery && (
        <p className="mb-4 text-sm text-gray-500">
          显示 {documents.length} 个"{searchQuery}"的搜索结果
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => {
          const statusInfo = 'processingStatus' in doc ? getProcessingStatusInfo(doc.processingStatus) : null;

          return (
            <div
              key={doc.id}
              className="card group cursor-pointer hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                {getIconForDocType(doc.type)}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate group-hover:whitespace-normal">
                      {doc.title}
                    </h3>
                  </div>

                  {/* 处理状态指示器 */}
                  {statusInfo && (
                    <div className="flex items-center gap-1 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    {new Date(doc.date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {/* 右侧操作区域 */}
                <div className="flex items-center space-x-2">
                  {activeDatabase === 'private' && !hideShareFeatures && (
                    <>
                      {'isShared' in doc && doc.isShared && (
                        <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                          已共享
                        </span>
                      )}
                      {onShare && !('isShared' in doc && doc.isShared) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShare(doc.id);
                          }}
                          className="rounded-full p-2 hover:bg-gray-100"
                        >
                          <Share2 className="h-4 w-4 text-gray-500 hover:text-primary-600" />
                        </button>
                      )}
                    </>
                  )}

                  {/* 三点菜单 */}
                  {activeDatabase === 'private' && onDelete && (
                    <div className="relative" ref={openDropdownId === doc.id ? dropdownRef : null}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === doc.id ? null : doc.id);
                        }}
                        className="rounded-full p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* 下拉菜单 */}
                      {openDropdownId === doc.id && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(doc.id);
                                setOpenDropdownId(null);
                              }}
                              className="flex items-center w-full px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              删除
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 处理状态描述 - 非完成状态显示 */}
              {('processingStatus' in doc) && doc.processingStatus !== 'completed' && statusInfo && (
                <div className="mt-4 text-xs text-gray-500">
                  <p>{statusInfo.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {documents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">未找到文档</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? `没有找到与"${searchQuery}"匹配的文档`
              : '开始上传或创建文档'}
          </p>
          <div className="mt-6">
            <button 
              className="btn-primary"
              onClick={() => window.location.href = '/my-workspace/process'}
            >
              上传文档
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGrid;