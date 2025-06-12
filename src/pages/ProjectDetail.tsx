import { useState, useEffect } from 'react';
import { Search, Upload, Share2, ArrowLeft, FileText, Edit3, Plus, X, FileUp, Clock, MoreHorizontal, Trash2 } from 'lucide-react';
import DocumentGrid from '../components/knowledgeBase/DocumentGrid';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  thumbnail: string;
  usageCount: string;
}

interface WrittenDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  industry: string;
  status: 'draft' | 'writing' | 'review' | 'completed';
  lastModified: string;
  author: string;
  wordCount: number;
  completionPercentage: number;
}

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [processingFilter, setProcessingFilter] = useState<'all' | 'text_splitting' | 'processing' | 'pending_validation' | 'completed' | 'failed'>('all');
  
  // 检测是否是共享项目视图
  const isSharedProject = location.pathname.startsWith('/shared-database/');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'multiple'>('single');
  const [activeTab, setActiveTab] = useState<'upload' | 'write'>('upload');
  const [selectedCategory, setSelectedCategory] = useState('报告书');
  const [selectedIndustry, setSelectedIndustry] = useState('家居行业');
  const [selectedDocumentCategory, setSelectedDocumentCategory] = useState('可研报告');
  const [customDocumentCategory, setCustomDocumentCategory] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isProjectShared, setIsProjectShared] = useState(false);
  const [documentStatusCounts, setDocumentStatusCounts] = useState({
    text_splitting: 1,
    processing: 1,
    pending_validation: 1,
    completed: 1,
    failed: 1
  });

  // 模拟项目数据
  const projectData = {
    id: projectId,
    name: projectId === '1' ? '环保科技园区环评项目' :
          projectId === '2' ? '工业污水处理厂建设项目' :
          projectId === '3' ? '新能源发电站环境影响评价' : '未知项目',
    description: '2024年环境影响评价报告编制项目',
    status: 'active' as const,
    createdAt: '2024-04-10',
    documentsCount: 12,
    isShared: isProjectShared
  };

  // 模拟私人空间文档数据（与DocumentGrid保持一致）
  const getPrivateDocuments = () => {
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
  };

  // 计算处理状态统计
  const calculateStatusCounts = () => {
    const documents = getPrivateDocuments();
    const counts = {
      text_splitting: 0,
      processing: 0,
      pending_validation: 0,
      completed: 0,
      failed: 0
    };

    documents.forEach(doc => {
      if (doc.processingStatus && counts.hasOwnProperty(doc.processingStatus)) {
        counts[doc.processingStatus as keyof typeof counts]++;
      }
    });

    return counts;
  };

  // 更新状态统计
  useEffect(() => {
    const newCounts = calculateStatusCounts();
    setDocumentStatusCounts(newCounts);
  }, []);

  // 行业分类
  const industries = [
    '家居行业',
    '建材行业',
    '电子原件和电子专用材料制造行业',
    '电器机械和器材制造行业',
    '通用设备制造行业',
    '专业实验室及研发实验基地类',
    '塑料制品行业',
    '医院行业'
  ];

  // 模板分类
  const categories = [
    '报告书',
    '报告表',
    '应急预案',
    '验收报告'
  ];

  // 上传文档分类
  const uploadDocumentCategories = [
    '可研报告',
    '环境检测报告',
    '环境监测报告',
    '技术方案',
    '其他'
  ];

  // 模拟模板数据
  const templates: Template[] = [
    {
      id: '1',
      name: '建设项目环境影响报告书',
      description: '适用于大型建设项目的环境影响评价报告编制',
      category: '报告书',
      industry: '家居行业',
      thumbnail: '/api/placeholder/200/150',
      usageCount: '8万人使用'
    },
    {
      id: '2',
      name: '建设项目环境影响报告表',
      description: '适用于中小型建设项目的环境影响评价',
      category: '报告表',
      industry: '建材行业',
      thumbnail: '/api/placeholder/200/150',
      usageCount: '12万人使用'
    },
    {
      id: '3',
      name: '水土保持方案报告书',
      description: '生产建设项目水土保持方案编制模板',
      category: '报告书',
      industry: '电子原件和电子专用材料制造行业',
      thumbnail: '/api/placeholder/200/150',
      usageCount: '3万人使用'
    },
    {
      id: '4',
      name: '安全预评价报告书',
      description: '建设项目安全预评价报告模板',
      category: '报告书',
      industry: '电器机械和器材制造行业',
      thumbnail: '/api/placeholder/200/150',
      usageCount: '2万人使用'
    },
    {
      id: '5',
      name: '环境影响报告表',
      description: '适用于环境影响较小的建设项目',
      category: '报告表',
      industry: '通用设备制造行业',
      thumbnail: '/api/placeholder/200/150',
      usageCount: '5万人使用'
    },
    {
      id: '6',
      name: '突发环境事件应急预案',
      description: '企业突发环境事件应急预案编制模板',
      category: '应急预案',
      industry: '家居行业',
      thumbnail: '/api/placeholder/200/150',
      usageCount: '1.5万人使用'
    },
    {
      id: '7',
      name: '建设项目竣工环境保护验收报告',
      description: '建设项目竣工环境保护验收报告模板',
      category: '验收报告',
      industry: '建材行业',
      thumbnail: '/api/placeholder/200/150',
      usageCount: '6万人使用'
    },
    {
      id: '8',
      name: '化工企业应急预案',
      description: '化工企业突发环境事件应急预案专用模板',
      category: '应急预案',
      industry: '塑料制品行业',
      thumbnail: '/api/placeholder/200/150',
      usageCount: '4万人使用'
    },
    {
      id: '9',
      name: '污染治理设施验收报告',
      description: '污染治理设施竣工验收报告模板',
      category: '验收报告',
      industry: '医院行业',
      thumbnail: '/api/placeholder/200/150',
      usageCount: '2.5万人使用'
    }
  ];

  // 模拟已创建文档数据
  const writtenDocuments: WrittenDocument[] = [
    {
      id: '1',
      title: '环保科技园区建设项目环境影响报告书',
      content: '本报告书针对环保科技园区建设项目进行全面的环境影响评价，分析项目建设和运营过程中可能产生的环境影响...',
      category: '报告书',
      industry: '家居行业',
      status: 'writing',
      lastModified: '2024-04-15 16:30',
      author: '张明',
      wordCount: 12580,
      completionPercentage: 75
    },
    {
      id: '3',
      title: '环境风险评估报告',
      content: '本报告对项目可能产生的环境风险进行系统评估，包括环境风险识别、风险分析、风险评价及风险管理措施...',
      category: '报告书',
      industry: '家居行业',
      status: 'completed',
      lastModified: '2024-04-12 14:45',
      author: '王芳',
      wordCount: 15240,
      completionPercentage: 100
    }
  ];

  const handleConfirmShare = () => {
    setShowShareModal(false);
  };

  const handleBackToProjects = () => {
    if (isSharedProject) {
      navigate('/shared-database');
    } else {
      navigate('/my-workspace/private');
    }
  };

  const handleCreateFromTemplate = (templateId: string) => {
    console.log('使用模板创建文档:', templateId);
    setShowTemplateModal(false);
    // 生成新文档ID并跳转到文档编辑页面
    const newDocId = `doc_${Date.now()}`;
    navigate(`/my-workspace/editor/${newDocId}`, {
      state: { templateId, projectId }
    });
  };

  const handleCreateBlankDocument = () => {
    console.log('创建空白文档');
    setShowTemplateModal(false);
    // 生成新文档ID并跳转到空白文档编辑页面
    const newDocId = `doc_${Date.now()}`;
    navigate(`/my-workspace/editor/${newDocId}`, {
      state: { projectId }
    });
  };

  const handleFileSelect = (_file: File) => {
    // 检查是否选择了"其他"但没有输入自定义类型
    if (selectedDocumentCategory === '其他' && !customDocumentCategory.trim()) {
      alert('请输入文档类型');
      return;
    }

    // 模拟生成新文档ID
    const newDocId = `doc_${Date.now()}`;

    setShowUploadModal(false);

    // 确定最终的文档分类
    const finalDocumentCategory = selectedDocumentCategory === '其他' 
      ? customDocumentCategory.trim() 
      : selectedDocumentCategory;

    // 跳转到第一步文本分割页面，并传递文档分类信息
    navigate(`/my-workspace/process-step1/${newDocId}`, {
      state: { 
        projectId,
        documentCategory: finalDocumentCategory 
      }
    });
  };

  const handleViewDocument = (documentId: string) => {
    console.log('查看文档:', documentId);
    // 跳转到文档编辑页面
    navigate(`/my-workspace/editor/${documentId}`, {
      state: { projectId, mode: 'edit' }
    });
  };

  const handleExportDocument = (documentId: string) => {
    console.log('导出文档:', documentId);
    alert(`正在导出文档 ${documentId}`);
    setOpenDropdownId(null);
  };

  const handleDeleteDocument = (documentId: string) => {
    console.log('删除文档:', documentId);
    if (confirm('确认删除此文档吗？此操作不可撤销。')) {
      alert(`文档 ${documentId} 已删除`);
    }
    setOpenDropdownId(null);
  };

  const handleDeleteReferenceDocument = (documentId: string) => {
    console.log('删除参考资料:', documentId);
    if (confirm('确认删除此参考资料吗？此操作不可撤销。')) {
      alert(`参考资料 ${documentId} 已删除`);
      // 这里应该调用API删除参考资料
      // 然后更新状态统计
      const newCounts = calculateStatusCounts();
      setDocumentStatusCounts(newCounts);
    }
  };

  const handleToggleProjectShare = () => {
    if (!hasCompletedDocuments()) {
      alert('只有包含已完成文档的项目才能共享');
      return;
    }
    
    setIsProjectShared(!isProjectShared);
    console.log(isProjectShared ? '关闭项目共享' : '开启项目共享');
  };

  const handleDeleteProject = () => {
    if (confirm('确定要删除此项目吗？此操作不可恢复。')) {
      console.log('删除项目:', projectId);
      // 这里应该调用删除项目的API
      navigate('/my-workspace/private');
    }
  };

  // 检查是否有已完成的文档
  const hasCompletedDocuments = () => {
    return writtenDocuments.some(doc => doc.status === 'completed');
  };

  const getStatusColor = (status: WrittenDocument['status']) => {
    switch (status) {
      case 'writing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: WrittenDocument['status']) => {
    switch (status) {
      case 'writing':
        return '编写中';
      case 'completed':
        return '已完成';
      default:
        return '未知';
    }
  };

  const filteredTemplates = templates.filter(template => 
    template.category === selectedCategory && template.industry === selectedIndustry
  );

  const filteredWrittenDocuments = writtenDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdownId) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  return (
    <div className="animate-fade-in space-y-6">
      {/* 头部导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToProjects}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {isSharedProject ? '返回共享数据库' : '返回项目列表'}
          </button>
        </div>
        
        {!isSharedProject && (
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleToggleProjectShare}
              disabled={!hasCompletedDocuments()}
              className={`btn-outline ${
                isProjectShared 
                  ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100' 
                  : hasCompletedDocuments() 
                    ? 'hover:bg-gray-50' 
                    : 'opacity-50 cursor-not-allowed'
              }`}
              title={!hasCompletedDocuments() ? '只有包含已完成文档的项目才能共享' : ''}
            >
              <Share2 className="mr-2 h-4 w-4" />
              {isProjectShared ? '关闭共享' : '开启共享'}
            </button>
            <button 
              onClick={handleDeleteProject}
              className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              删除项目
            </button>
          </div>
        )}
      </div>

      {/* 项目信息卡片 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{projectData.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{projectData.description}</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <span>创建时间：{projectData.createdAt}</span>
              <span>文档数量：{projectData.documentsCount}</span>
              {!isSharedProject && (
                <span className="flex items-center">
                  状态：
                  <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    进行中
                  </span>
                </span>
              )}
              {isProjectShared && (
                <span className="flex items-center">
                  共享状态：
                  <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    已共享
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 材料分类标签 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`${
              activeTab === 'upload'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium flex items-center`}
          >
            <Upload className="mr-2 h-4 w-4" />
            参考资料
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={`${
              activeTab === 'write'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium flex items-center`}
          >
            <Edit3 className="mr-2 h-4 w-4" />
            写材料
          </button>
        </nav>
      </div>

      {/* 操作栏 */}
      <div className="flex items-center justify-between gap-4">
        {!isSharedProject && (
          <div className="flex items-center space-x-2">
            {activeTab === 'upload' ? (
              <button 
                className="btn-primary"
                onClick={() => setShowUploadModal(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                上传文档
              </button>
            ) : (
              <button 
                className="btn-primary"
                onClick={() => setShowTemplateModal(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                新建材料
              </button>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <div className="relative w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={activeTab === 'upload' ? '搜索上传文档...' : '搜索写作材料...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input w-full pl-9 py-1.5 text-sm"
            />
          </div>

          {/* 处理状态筛选 - 只在参考资料标签页显示 */}
          {activeTab === 'upload' && (
            <div className="w-48">
              <select
                value={processingFilter}
                onChange={(e) => setProcessingFilter(e.target.value as any)}
                className="form-select w-full py-1.5 text-sm border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">全部状态</option>
                <option value="text_splitting">文本分割</option>
                <option value="processing">处理中</option>
                <option value="pending_validation">待验证</option>
                <option value="completed">已完成</option>
                <option value="failed">处理失败</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 文档内容区域 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {activeTab === 'upload' ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">参考资料</h3>

              {/* 状态统计 */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">文本分割: {documentStatusCounts.text_splitting}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">处理中: {documentStatusCounts.processing}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-600">待验证: {documentStatusCounts.pending_validation}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">已完成: {documentStatusCounts.completed}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">失败: {documentStatusCounts.failed}</span>
                </div>
              </div>
            </div>
            <DocumentGrid
              activeDatabase="private"
              searchQuery={searchQuery}
              filter={processingFilter}
              hideShareFeatures={true}
              onDelete={handleDeleteReferenceDocument}
            />
          </div>
        ) : (
          <div>            
            {filteredWrittenDocuments.length > 0 ? (
              <div className="space-y-4">
                {filteredWrittenDocuments.map((doc) => (
                  <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900 hover:text-primary-600 cursor-pointer"
                              onClick={() => handleViewDocument(doc.id)}>
                            {doc.title}
                          </h4>
                          {!isSharedProject && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                              {getStatusText(doc.status)}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {doc.content}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{doc.lastModified}</span>
                          </div>
                          <div>
                            <span>{doc.wordCount.toLocaleString()} 字</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex items-center ml-4">
                        <div className="relative">
                          <button 
                            onClick={() => setOpenDropdownId(openDropdownId === doc.id ? null : doc.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          
                          {/* 下拉菜单 */}
                          {openDropdownId === doc.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => handleExportDocument(doc.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Upload className="h-4 w-4 mr-3" />
                                  导出文档
                                </button>
                                {!isSharedProject && (
                                  <>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                      onClick={() => handleDeleteDocument(doc.id)}
                                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4 mr-3" />
                                      删除文档
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">暂无写作材料</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {isSharedProject ? '该项目暂无共享的写作材料' : '点击"新建材料"开始创建您的第一个文档'}
                </p>
                {!isSharedProject && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowTemplateModal(true)}
                      className="btn-primary"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      新建材料
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 上传文档模态框 */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6">
            <h3 className="text-lg font-medium text-gray-900">上传新文档</h3>
            <p className="mt-2 text-sm text-gray-500">
              选择上传模式并添加要处理的文档到当前项目。
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <button
                onClick={() => setUploadMode('single')}
                className={`flex flex-col items-center rounded-lg border p-4 ${
                  uploadMode === 'single'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <FileUp className={`h-8 w-8 ${
                  uploadMode === 'single' ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <span className="mt-2 font-medium">单文件上传</span>
                <span className="mt-1 text-xs text-gray-500">
                  上传单个文档进行处理
                </span>
              </button>

              <button
                disabled
                className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-4 opacity-50"
              >
                <FileUp className="h-8 w-8 text-gray-400" />
                <span className="mt-2 font-medium">批量上传</span>
                <span className="mt-1 text-xs text-gray-500">
                  即将推出
                </span>
              </button>
            </div>

            {/* 文档分类选择 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                文档分类 *
              </label>
              <select
                value={selectedDocumentCategory}
                onChange={(e) => setSelectedDocumentCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {uploadDocumentCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              
              {/* 当选择"其他"时显示自定义输入框 */}
              {selectedDocumentCategory === '其他' && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    请输入文档类型 *
                  </label>
                  <input
                    type="text"
                    value={customDocumentCategory}
                    onChange={(e) => setCustomDocumentCategory(e.target.value)}
                    placeholder="请输入具体的文档类型..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
              <div className="text-center">
                <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-900">
                  将文件拖放到此处或点击上传
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  支持 PDF、Word、Excel 或 PowerPoint 文件
                </p>
                <input
                  type="file"
                  id="project-file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />
                <button
                  onClick={() => document.getElementById('project-file-upload')?.click()}
                  className="btn-primary mt-4"
                >
                  选择文件
                </button>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="btn-outline"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 模板选择模态框 */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-6xl max-h-[90vh] rounded-lg bg-white overflow-hidden">
            {/* 模态框头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">选择模板</h3>
                <p className="text-sm text-gray-500">选择合适的模板快速开始文档编写</p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* 分类标签 */}
            <div className="px-6 py-4 border-b border-gray-200 space-y-4">
              {/* 文档类型分类 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">文档类型</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 行业分类 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">行业分类</h4>
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => setSelectedIndustry(industry)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        selectedIndustry === industry
                          ? 'bg-secondary-100 text-secondary-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 模板网格 */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* 空白文档选项 */}
                <div
                  className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-dashed"
                  onClick={handleCreateBlankDocument}
                >
                  {/* 空白文档图标 */}
                  <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
                    <Plus className="h-12 w-12 text-gray-400 group-hover:text-primary-500" />
                  </div>
                  
                  {/* 空白文档信息 */}
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                      创建空白文档
                    </h4>
                    <p className="mt-1 text-xs text-gray-500">
                      从空白文档开始，自由编写您的内容
                    </p>
                    <div className="mt-4 flex justify-center">
                      <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                        立即创建
                      </button>
                    </div>
                  </div>
                </div>

                {/* 现有模板 */}
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleCreateFromTemplate(template.id)}
                    >
                      {/* 模板缩略图 */}
                      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                      
                      {/* 模板信息 */}
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                          {template.name}
                        </h4>
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                          {template.description}
                        </p>
                        {/* 行业标签 */}
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {template.industry}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {template.usageCount}
                          </span>
                          <button className="text-xs text-primary-600 hover:text-primary-700">
                            使用模板
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">暂无匹配的模板</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      当前选择的文档类型和行业组合暂无可用模板，请尝试其他组合
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 共享模态框 */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="text-lg font-medium text-gray-900">共享文档到团队</h3>
            <p className="mt-2 text-sm text-gray-500">
              确认将此文档共享到您所在的团队？共享后，团队成员可以在共享空间中查看此文档。
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setShowShareModal(false)}
                className="btn-outline"
              >
                取消
              </button>
              <button 
                onClick={handleConfirmShare}
                className="btn-primary"
              >
                <Share2 className="mr-2 h-4 w-4" />
                确认共享
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail; 