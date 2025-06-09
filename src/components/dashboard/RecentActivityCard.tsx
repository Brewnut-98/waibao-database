import { useState } from 'react';
import { Clock, FileText, Database, Users } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'document',
    title: '行业监管2024.pdf',
    time: '2小时前',
    action: '已处理',
    icon: FileText,
    iconColor: 'text-blue-500 bg-blue-100',
  },
  {
    id: 2,
    type: 'database',
    title: '法律判例集',
    time: '5小时前',
    action: '已更新',
    icon: Database,
    iconColor: 'text-purple-500 bg-purple-100',
  },
  {
    id: 3,
    type: 'collaboration',
    title: '市场团队知识库',
    time: '1天前',
    action: '已共享',
    icon: Users,
    iconColor: 'text-green-500 bg-green-100',
  },
  {
    id: 4,
    type: 'document',
    title: 'Q2财务报告.docx',
    time: '2天前',
    action: '已生成',
    icon: FileText,
    iconColor: 'text-blue-500 bg-blue-100',
  },
  {
    id: 5,
    type: 'document',
    title: '专利申请指南.pdf',
    time: '3天前',
    action: '已处理',
    icon: FileText,
    iconColor: 'text-blue-500 bg-blue-100',
  },
];

const RecentActivityCard = () => {
  const [displayCount, setDisplayCount] = useState(4);

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">最近活动</h2>
        <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
          查看全部
        </button>
      </div>
      
      <div className="mt-6 flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {activities.slice(0, displayCount).map((activity) => (
            <li key={activity.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className={`rounded-full p-2 ${activity.iconColor}`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {activity.action}
                  </p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {displayCount < activities.length && (
        <div className="mt-6">
          <button
            onClick={() => setDisplayCount(activities.length)}
            className="w-full text-center text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            显示更多
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivityCard;