import { Bell, Menu, Search } from 'lucide-react';

interface TopBarProps {
  onMenuButtonClick: () => void;
}

const TopBar = ({ onMenuButtonClick }: TopBarProps) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <button
            type="button"
            className="md:hidden text-gray-500 focus:outline-none"
            onClick={onMenuButtonClick}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="relative max-w-md hidden sm:flex">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索知识库..."
              className="form-input w-full pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <button className="relative rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;