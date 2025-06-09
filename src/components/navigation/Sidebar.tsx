import { Link, useLocation } from 'react-router-dom';
import { 
  BrainCircuit, 
  Database, 
  FileSpreadsheet, 
  FileText, 
  Home, 
  Settings, 
  Users, 
  X,
  ChevronDown,
  Globe,
  FileLock,
  FolderCog
} from 'lucide-react';

type SidebarProps = {
  mobile?: boolean;
  onClose?: () => void;
};

const Sidebar = ({ mobile = false, onClose }: SidebarProps) => {
  const location = useLocation();
  
  const navigation = [
    { name: '我的空间', href: '/my-workspace/private', icon: FileLock },
    { name: '共享空间', href: '/shared-database', icon: Users },
    { name: '资料处理进度', href: '/my-workspace/process', icon: FileSpreadsheet },
  ];

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 flex-shrink-0 items-center px-4">
        {mobile && (
          <button
            type="button"
            className="md:hidden absolute top-4 right-4 text-gray-500"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        )}
        <Link to="/" className="flex items-center">
          <BrainCircuit className="h-8 w-auto text-primary-600" />
          <span className="ml-2 text-xl font-semibold text-gray-900">智慧库</span>
        </Link>
      </div>
      <div className="mt-5 flex flex-grow flex-col">
        <nav className="flex-1 space-y-1 px-2 pb-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href === '/my-workspace/private' && location.pathname.startsWith('/my-workspace/private')) ||
              (item.href === '/my-workspace/process' && (location.pathname.startsWith('/my-workspace/process') || location.pathname.startsWith('/my-workspace/validation') || location.pathname.startsWith('/my-workspace/data-check')));

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors`}
              >
                <item.icon
                  className={`${
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 h-5 w-5 flex-shrink-0`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full bg-gray-100"
                src="https://images.pexels.com/photos/4350093/pexels-photo-4350093.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="用户头像"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">张明</p>
                <p className="text-xs text-gray-500">XXX公司XXX团队</p>
              </div>
            </div>
            <button className="rounded-full p-1 hover:bg-gray-100">
              <ChevronDown className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;