import { FileLock, Globe, Users } from 'lucide-react';

interface DatabaseTypeSelectorProps {
  activeDatabase: 'public' | 'shared' | 'private';
  onChange: (type: 'public' | 'shared' | 'private') => void;
}

const DatabaseTypeSelector = ({ activeDatabase, onChange }: DatabaseTypeSelectorProps) => {
  const databaseTypes = [
    {
      id: 'public',
      name: '公共数据库',
      description: '行业数据、法律参考资料',
      icon: Globe,
      count: 845,
    },
    {
      id: 'shared',
      name: '共享空间',
      description: '团队和组织知识',
      icon: Users,
      count: 324,
    },
    {
      id: 'private',
      name: '私有数据库',
      description: '您的个人上传和笔记',
      icon: FileLock,
      count: 156,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {databaseTypes.map((db) => {
        const isActive = activeDatabase === db.id;
        return (
          <button
            key={db.id}
            onClick={() => onChange(db.id as any)}
            className={`${
              isActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 bg-white hover:bg-gray-50'
            } flex flex-col items-start rounded-lg border p-4 text-left transition-colors`}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                <div className={`rounded-full p-2 ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                  <db.icon className="h-5 w-5" />
                </div>
                <h3 className="ml-3 font-medium text-gray-900">{db.name}</h3>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isActive ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {db.count}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">{db.description}</p>
          </button>
        );
      })}
    </div>
  );
};

export default DatabaseTypeSelector;