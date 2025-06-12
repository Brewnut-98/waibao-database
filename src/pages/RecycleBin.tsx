import { useState } from 'react';
import { Search, RotateCcw, Trash2, FileText, Upload, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecycleBinItem {
  id: string;
  title: string;
  type: 'upload' | 'document';
  size?: string;
  deletedAt: string;
  originalPath: string;
  projectName: string;
}

const RecycleBin = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'document'>('upload');

  // 模拟回收站数据
  const recycleBinItems: RecycleBinItem[] = [
    {
      id: '1',
      title: '2024年法律合规指南.pdf',
      type: 'upload',
      size: '2.5 MB',
      deletedAt: '2024-04-10 16:30',
      originalPath: '/我的空间/环保科技园区环评项目',
      projectName: '环保科技园区环评项目'
    },
    {
      id: '2',
      title: '市场分析报告.docx',
      type: 'upload',
      size: '1.8 MB',
      deletedAt: '2024-04-10 15:25',
      originalPath: '/我的空间/工业污水处理厂建设项目',
      projectName: '工业污水处理厂建设项目'
    },
    {
      id: '3',
      title: '环境影响评价报告书',
      type: 'document',
      deletedAt: '2024-04-10 14:20',
      originalPath: '/我的空间/新能源发电站环境影响评价',
      projectName: '新能源发电站环境影响评价'
    },
    {
      id: '4',
      title: '技术规范文档.pdf',
      type: 'upload',
      size: '4.2 MB',
      deletedAt: '2024-04-10 13:15',
      originalPath: '/我的空间/化工园区规划环评',
      projectName: '化工园区规划环评'
    },
    {
      id: '5',
      title: '工程设计方案',
      type: 'document',
      deletedAt: '2024-04-10 12:10',
      originalPath: '/我的空间/环保科技园区环评项目',
      projectName: '环保科技园区环评项目'
    },
    {
      id: '6',
      title: '施工组织设计',
      type: 'document',
      deletedAt: '2024-04-09 18:45',
      originalPath: '/我的空间/工业污水处理厂建设项目',
      projectName: '工业污水处理厂建设项目'
    }
  ];

  const handleRestore = (itemId: string) => {
    console.log('恢复项目:', itemId);
    alert(`恢复项目: ${itemId}`);
  };

  const handlePermanentDelete = (itemId: string) => {
    console.log('永久删除:', itemId);
    if (confirm('确定要永久删除此项目吗？此操作无法撤销。')) {
      alert(`永久删除: ${itemId}`);
    }
  };

  const filteredItems = recycleBinItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = item.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">回收站</h1>
          <p className="text-sm text-gray-500">管理已删除的文档和资料</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex rounded-lg border border-gray-200 bg-white">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'upload'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            } rounded-l-lg border-r border-gray-200`}
          >
            <Upload className="mr-2 h-4 w-4 inline-block" />
            上传资料
          </button>
          <button
            onClick={() => setActiveTab('document')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'document'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            } rounded-r-lg`}
          >
            <FileText className="mr-2 h-4 w-4 inline-block" />
            撰写文档
          </button>
        </div>

        <div className="relative w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="搜索已删除的项目..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input w-full pl-9 py-1.5 text-sm"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {activeTab === 'upload' ? '文档名称' : '文档标题'}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                项目文件夹
              </th>
              {activeTab === 'upload' && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  大小
                </th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                删除时间
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                原路径
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      {item.type === 'upload' ? (
                        <Upload className="h-5 w-5 text-gray-400 mr-3" />
                      ) : (
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      )}
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{item.projectName}</div>
                  </td>
                  {activeTab === 'upload' && (
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {item.size || '-'}
                    </td>
                  )}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {item.deletedAt}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {item.originalPath}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleRestore(item.id)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors text-green-700 bg-green-100 hover:bg-green-200"
                        title="恢复"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        恢复
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(item.id)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors text-red-700 bg-red-100 hover:bg-red-200"
                        title="永久删除"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={activeTab === 'upload' ? 6 : 5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Trash2 className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {activeTab === 'upload' ? '上传资料' : '撰写文档'}回收站为空
                    </h3>
                    <p className="text-sm text-gray-500">
                      没有找到已删除的{activeTab === 'upload' ? '上传资料' : '撰写文档'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Info Panel */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Trash2 className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">回收站说明</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>删除的项目会在回收站中保留30天</li>
                <li>30天后将自动永久删除</li>
                <li>可以选择恢复项目到原位置或永久删除</li>
                <li>永久删除的项目无法恢复，请谨慎操作</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecycleBin; 