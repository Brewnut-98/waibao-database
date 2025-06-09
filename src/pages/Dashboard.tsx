import { useState } from 'react';
import { BarChart3, BookOpen, Clock, FileText, Upload } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentActivityCard from '../components/dashboard/RecentActivityCard';
import QuickAccessCard from '../components/dashboard/QuickAccessCard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">仪表盘</h1>
          <p className="text-sm text-gray-500">欢迎回来，张明！这是您的最新动态。</p>
        </div>
        
        <div className="flex space-x-2">
          <button className="btn-outline">
            <Upload className="mr-2 h-4 w-4" />
            上传文档
          </button>
          <button className="btn-primary">
            <FileText className="mr-2 h-4 w-4" />
            新建报告
          </button>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: '概览' },
            { id: 'projects', name: '项目' },
            { id: 'documents', name: '文档' },
            { id: 'reports', name: '报告' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="已处理文档" 
          value="128" 
          change="+12%" 
          trend="up" 
          icon={FileText} 
          color="bg-primary-500" 
        />
        <StatCard 
          title="知识卡片" 
          value="1,842" 
          change="+8%" 
          trend="up" 
          icon={BookOpen} 
          color="bg-secondary-500" 
        />
        <StatCard 
          title="已生成报告" 
          value="32" 
          change="+4%" 
          trend="up" 
          icon={BarChart3} 
          color="bg-accent-500" 
        />
        <StatCard 
          title="处理时间" 
          value="3.2分钟" 
          change="-0.8分钟" 
          trend="down" 
          icon={Clock} 
          color="bg-green-500" 
        />
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RecentActivityCard />
        <QuickAccessCard />
      </div>
    </div>
  );
};

export default Dashboard;