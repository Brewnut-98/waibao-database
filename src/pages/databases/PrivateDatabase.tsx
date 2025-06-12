import { useState, useEffect } from 'react';
import { Search, Plus, FolderOpen, Calendar, FileText, MoreVertical, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  documentsCount: number;
  lastModified: string;
  isShared: boolean;
  documentType: '报告书' | '报告表';
  category: '生态类' | '工业类';
}

const PrivateDatabase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('生态类');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [documentTypeFilter, setDocumentTypeFilter] = useState<'all' | '报告书' | '报告表'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | '生态类' | '工业类'>('all');
  const navigate = useNavigate();
  const location = useLocation();

  // 监听路由状态，自动设置筛选条件
  useEffect(() => {
    if (location.state) {
      const { documentTypeFilter: docTypeFilter, categoryFilter: catFilter } = location.state as {
        documentTypeFilter?: '报告书' | '报告表';
        categoryFilter?: '生态类' | '工业类';
      };
      
      if (docTypeFilter) {
        setDocumentTypeFilter(docTypeFilter);
      }
      if (catFilter) {
        setCategoryFilter(catFilter);
      }
      
      // 清除状态以避免重复设置
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  // 项目分类
  const projectCategories = [
    '生态类',
    '工业类'
  ];

  // 文档类型
  const documentTypes = [
    '报告书',
    '报告表'
  ];

  // 模拟项目数据
  const projects: Project[] = [
    {
      id: '1',
      name: '环保科技园区环评项目',
      description: '2024年环保科技园区建设项目环境影响评价报告编制',
      status: 'active',
      createdAt: '2024-04-01',
      documentsCount: 12,
      lastModified: '2024-04-10 14:30',
      isShared: false,
      documentType: '报告书',
      category: '生态类'
    },
    {
      id: '2',
      name: '工业污水处理厂建设项目',
      description: '某市工业污水处理厂扩建项目环评报告',
      status: 'active',
      createdAt: '2024-03-15',
      documentsCount: 8,
      lastModified: '2024-04-09 16:20',
      isShared: true,
      documentType: '报告表',
      category: '工业类'
    },
    {
      id: '3',
      name: '新能源发电站环境影响评价',
      description: '风力发电站建设项目环境影响评价',
      status: 'completed',
      createdAt: '2024-02-20',
      documentsCount: 15,
      lastModified: '2024-03-25 10:15',
      isShared: false,
      documentType: '报告书',
      category: '生态类'
    },
    {
      id: '4',
      name: '化工园区规划环评',
      description: '化工产业园区总体规划环境影响评价',
      status: 'archived',
      createdAt: '2024-01-10',
      documentsCount: 20,
      lastModified: '2024-02-15 09:30',
      isShared: true,
      documentType: '报告书',
      category: '工业类'
    }
  ];

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      // 这里应该调用API创建项目
      console.log('创建项目:', { 
        name: newProjectName, 
        description: newProjectDescription,
        category: newProjectCategory 
      });
      setShowCreateModal(false);
      setNewProjectName('');
      setNewProjectDescription('');
      setNewProjectCategory('生态类');
      // 模拟创建成功后跳转到新项目
      const newProjectId = Date.now().toString();
      navigate(`/my-workspace/private/${newProjectId}`);
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/my-workspace/private/${projectId}`);
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return '进行中';
      case 'completed':
        return '已完成';
      case 'archived':
        return '已归档';
      default:
        return '未知';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesDocumentType = documentTypeFilter === 'all' || project.documentType === documentTypeFilter;
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    return matchesSearch && matchesFilter && matchesDocumentType && matchesCategory;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">我的空间</h1>
          <p className="text-sm text-gray-500">管理您的环评项目和相关文档</p>
        </div>
        
        <button 
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          新建项目
        </button>
      </div>

      {/* 筛选器和搜索 */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {/* 文档类型筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">文档类型:</span>
            <div className="flex rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => setDocumentTypeFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium ${
                  documentTypeFilter === 'all'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                } rounded-l-lg border-r border-gray-200`}
              >
                全部
              </button>
              {documentTypes.map((type, index) => (
                <button
                  key={type}
                  onClick={() => setDocumentTypeFilter(type as '报告书' | '报告表')}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    documentTypeFilter === type
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  } ${
                    index === documentTypes.length - 1 ? 'rounded-r-lg' : 'border-r border-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 项目分类筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">项目分类:</span>
            <div className="flex rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium ${
                  categoryFilter === 'all'
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                } rounded-l-lg border-r border-gray-200`}
              >
                全部
              </button>
              {projectCategories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category as '生态类' | '工业类')}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    categoryFilter === category
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  } ${
                    index === projectCategories.length - 1 ? 'rounded-r-lg' : 'border-r border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 项目状态筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">项目状态:</span>
            <div className="flex rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                } rounded-l-lg border-r border-gray-200`}
              >
                全部
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1.5 text-sm font-medium ${
                  filter === 'active'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                } border-r border-gray-200`}
              >
                进行中
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 text-sm font-medium ${
                  filter === 'completed'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                } rounded-r-lg`}
              >
                已完成
              </button>
            </div>
          </div>
        </div>

        <div className="relative w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="搜索项目..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input w-full pl-9 py-1.5 text-sm"
          />
        </div>
      </div>

      {/* 项目网格 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group relative bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleProjectClick(project.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <FolderOpen className="h-8 w-8 text-primary-600" />
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                    {project.name}
                  </h3>
                </div>
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
              {project.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </span>
              
              {project.isShared && (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  已共享
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                {project.documentsCount} 个文档
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {project.lastModified}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">暂无项目</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? '没有找到匹配的项目' : '开始创建您的第一个环评项目'}
          </p>
          {!searchQuery && (
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                新建项目
              </button>
            </div>
          )}
        </div>
      )}

      {/* 创建项目模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="text-lg font-medium text-gray-900">新建项目</h3>
            <p className="mt-2 text-sm text-gray-500">
              创建一个新的环评项目来管理相关文档和资料
            </p>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  项目名称 *
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="mt-1 form-input w-full"
                  placeholder="请输入项目名称"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  项目分类 *
                </label>
                <div className="mt-2 flex rounded-lg border border-gray-200 bg-white">
                  {projectCategories.map((category, index) => (
                    <button
                      key={category}
                      onClick={() => setNewProjectCategory(category)}
                      className={`px-4 py-2 text-sm font-medium ${
                        newProjectCategory === category
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      } ${
                        index === 0 ? 'rounded-l-lg' : ''
                      } ${
                        index === projectCategories.length - 1 ? 'rounded-r-lg' : 'border-r border-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  项目描述
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  rows={3}
                  className="mt-1 form-input w-full"
                  placeholder="请输入项目描述（可选）"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setNewProjectName('');
                  setNewProjectDescription('');
                  setNewProjectCategory('生态类');
                }}
                className="btn-outline"
              >
                取消
              </button>
              <button 
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="mr-2 h-4 w-4" />
                创建项目
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateDatabase;