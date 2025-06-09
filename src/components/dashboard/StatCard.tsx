import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: string;
}

const StatCard = ({ title, value, change, trend, icon: Icon, color }: StatCardProps) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center">
        <div className={`rounded-md ${color} p-2 text-white`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-semibold text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span
          className={`inline-flex items-center text-xs font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change}
        </span>
        <span className="text-xs text-gray-500 ml-2">from last month</span>
      </div>
    </div>
  );
};

export default StatCard;