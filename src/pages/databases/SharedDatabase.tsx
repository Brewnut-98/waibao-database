
import { FolderOpen, Calendar, FileText, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SharedProject {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  documentsCount: number;
  lastModified: string;
  sharedBy: string;
  sharedByAvatar?: string;
}

const SharedDatabase = () => {
  const navigate = useNavigate();

  const projects: SharedProject[] = [
    {
      id: '1',
      name: '生态保护区环评项目',
      description: '某市生态保护区建设项目环境影响评价报告编制，包含生态影响分析和保护措施',
      status: 'active',
      createdAt: '2024-04-01',
      documentsCount: 32,
      lastModified: '2024-04-10 14:30',
      sharedBy: '张明'
    },
    {
      id: '2',
      name: '矿山开采环境影响评价',
      description: '大型露天矿山开采项目环境影响评价，涵盖地质环境和水土保持分析',
      status: 'active',
      createdAt: '2024-03-15',
      documentsCount: 28,
      lastModified: '2024-04-08 16:20',
      sharedBy: '李华'
    },
    {
      id: '3',
      name: '城市轨道交通环评',
      description: '城市轨道交通建设项目环境影响评价，包含噪声、振动等环境因子分析',
      status: 'completed',
      createdAt: '2024-02-20',
      documentsCount: 45,
      lastModified: '2024-03-25 10:15',
      sharedBy: '王芳'
    },
    {
      id: '4',
      name: '石化园区规划环评',
      description: '大型石化产业园区总体规划环境影响评价，涵盖大气、水环境等多要素评估',
      status: 'active',
      createdAt: '2024-01-10',
      documentsCount: 18,
      lastModified: '2024-04-05 09:30',
      sharedBy: '刘强'
    }
  ];



  const handleProjectClick = (projectId: string) => {
    // 跳转到共享项目详情页面
    navigate(`/shared-database/${projectId}`);
  };

  const filteredProjects = projects;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">共享空间</h1>
          <p className="text-sm text-gray-500">团队共享的项目</p>
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

            <div className="mt-4 flex items-center justify-end">
              <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                <User className="h-3 w-3 mr-1" />
                {project.sharedBy}
              </div>
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">暂无共享项目</h3>
          <p className="mt-1 text-sm text-gray-500">
            还没有团队成员分享项目
          </p>
        </div>
      )}
    </div>
  );
};

export default SharedDatabase;