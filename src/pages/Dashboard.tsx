import { useState } from 'react';
import { BarChart3, BookOpen, Clock, FileText, Upload, ChevronRight, Leaf, Factory } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import RecentActivityCard from '../components/dashboard/RecentActivityCard';
import QuickAccessCard from '../components/dashboard/QuickAccessCard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // 快捷入口数据
  const quickAccess = [
    {
      id: 'eco-report',
      title: '生态类报告书',
      description: '创建生态环境影响评价报告书',
      icon: Leaf,
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      documentType: '报告书',
      category: '生态类'
    },
    {
      id: 'eco-table',
      title: '生态类报告表',
      description: '创建生态环境影响评价报告表',
      icon: Leaf,
      bgColor: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600',
      documentType: '报告表',
      category: '生态类'
    },
    {
      id: 'industrial-report',
      title: '工业类报告书',
      description: '创建工业项目环境影响评价报告书',
      icon: Factory,
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      documentType: '报告书',
      category: '工业类'
    },
    {
      id: 'industrial-table',
      title: '工业类报告表',
      description: '创建工业项目环境影响评价报告表',
      icon: Factory,
      bgColor: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
      documentType: '报告表',
      category: '工业类'
    }
  ];

  const handleQuickAccess = (item: typeof quickAccess[0]) => {
    // 跳转到我的空间并设置筛选条件
    navigate('/my-workspace/private', {
      state: {
        documentTypeFilter: item.documentType,
        categoryFilter: item.category
      }
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">仪表盘</h1>
          <p className="text-sm text-gray-500">欢迎回来，张明！这是您的最新动态。</p>
        </div>
      </div>
      {/* 快捷入口工作台 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">快捷工作台</h2>
            <p className="text-sm text-gray-500">选择项目类型快速开始工作</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickAccess.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleQuickAccess(item)}
                className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* 背景装饰 */}
                <div className={`absolute top-0 right-0 w-20 h-20 ${item.bgColor} opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-200`}></div>

                {/* 图标 */}
                <div className={`inline-flex items-center justify-center w-12 h-12 ${item.bgColor} ${item.hoverColor} rounded-lg text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="h-6 w-6" />
                </div>

                {/* 内容 */}
                <div className="relative">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* 操作指示 */}
                  <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-700">
                    <span>快速开始</span>
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RecentActivityCard />
      </div>
    </div>
  );
};

export default Dashboard;