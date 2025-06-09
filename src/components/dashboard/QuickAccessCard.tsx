import { Briefcase, FileSpreadsheet, FileText, FolderOpen, Library, Users } from 'lucide-react';

const quickAccessItems = [
  {
    id: 1,
    name: '法律数据库',
    description: '公共法律参考和文档',
    icon: Library,
    color: 'text-blue-600 bg-blue-100',
  },
  {
    id: 2,
    name: '研究团队文档',
    description: '共享研究和分析',
    icon: Users,
    color: 'text-purple-600 bg-purple-100',
  },
  {
    id: 3,
    name: '市场分析报告',
    description: '生成于2025年5月15日',
    icon: FileText,
    color: 'text-green-600 bg-green-100',
  },
  {
    id: 4,
    name: '最近上传',
    description: '12个文档正在处理队列中',
    icon: FileSpreadsheet,
    color: 'text-amber-600 bg-amber-100',
  },
];

const QuickAccessCard = () => {
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">快速访问</h2>
        <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
          自定义
        </button>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quickAccessItems.map((item) => (
          <button
            key={item.id}
            className="flex flex-col items-center rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-50 transition-colors duration-200"
          >
            <div className={`rounded-full p-2 ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-2 font-medium text-gray-900">{item.name}</h3>
            <p className="mt-1 text-xs text-gray-500">{item.description}</p>
          </button>
        ))}
      </div>
      
      <button className="btn-outline w-full mt-4">
        <FolderOpen className="mr-2 h-4 w-4" />
        浏览所有资源
      </button>
    </div>
  );
};

export default QuickAccessCard;