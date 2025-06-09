import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const PublicDatabase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('home');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const industries = [
    { id: 'home', name: '家居类' },
    { id: 'building', name: '建材类' },
    { id: 'electronic', name: '电子原件和电子专用材料制造类' },
    { id: 'electrical', name: '电器机械和器材制造类' },
    { id: 'equipment', name: '通用设备制造类' },
    { id: 'lab', name: '专业实验室及研发实验基地类' },
    { id: 'plastic', name: '塑料制品类' },
    { id: 'hospital', name: '医院类' }
  ];

  const documentTypes = [
    { id: 'all', name: '全部类型' },
    { id: 'law', name: '法律法规' },
    { id: 'standard', name: '行业标准' },
    { id: 'tech', name: '技术规范' }
  ];

  const documents = [
    {
      id: 1,
      title: '2024年法律合规指南',
      category: '法律文档',
      date: '2024-04-10',
      type: 'law',
      industry: 'home',
    },
    {
      id: 2,
      title: '行业标准概述',
      category: '技术标准',
      date: '2024-03-22',
      type: 'standard',
      industry: 'electronic',
    },
    {
      id: 3,
      title: '财务报告要求',
      category: '财务参考',
      date: '2024-02-15',
      type: 'tech',
      industry: 'hospital',
    },
    {
      id: 4,
      title: '2024年Q1市场分析',
      category: '行业报告',
      date: '2024-04-05',
      type: 'standard',
      industry: 'equipment',
    },
    {
      id: 5,
      title: '监管合规检查清单',
      category: '法律文档',
      date: '2024-03-30',
      type: 'law',
      industry: 'building',
    },
    {
      id: 6,
      title: '竞争对手分析框架',
      category: '行业报告',
      date: '2024-03-15',
      type: 'tech',
      industry: 'plastic',
    },
    {
      id: 7,
      title: '家居产品安全标准指南',
      category: '技术标准',
      date: '2024-04-12',
      type: 'standard',
      industry: 'home',
    },
    {
      id: 8,
      title: '医疗设备管理规范',
      category: '技术规范',
      date: '2024-04-08',
      type: 'tech',
      industry: 'hospital',
    },
    {
      id: 9,
      title: '电子产品质量控制标准',
      category: '技术标准',
      date: '2024-04-01',
      type: 'standard',
      industry: 'electronic',
    },
    {
      id: 10,
      title: '实验室安全操作指南',
      category: '技术规范',
      date: '2024-03-28',
      type: 'tech',
      industry: 'lab',
    },
    {
      id: 11,
      title: '建材环保认证要求',
      category: '法律文档',
      date: '2024-03-25',
      type: 'law',
      industry: 'building',
    },
    {
      id: 12,
      title: '塑料制品生产规范',
      category: '技术标准',
      date: '2024-03-20',
      type: 'standard',
      industry: 'plastic',
    },
    {
      id: 13,
      title: '设备维护保养指南',
      category: '技术规范',
      date: '2024-03-18',
      type: 'tech',
      industry: 'equipment',
    },
    {
      id: 14,
      title: '医疗废物处理规范',
      category: '法律文档',
      date: '2024-03-15',
      type: 'law',
      industry: 'hospital',
    },
    {
      id: 15,
      title: '电子元件测试标准',
      category: '技术标准',
      date: '2024-03-12',
      type: 'standard',
      industry: 'electronic',
    },
    {
      id: 16,
      title: '实验室认证要求',
      category: '法律文档',
      date: '2024-03-10',
      type: 'law',
      industry: 'lab',
    },
    {
      id: 17,
      title: '家具产品标准更新',
      category: '技术标准',
      date: '2024-03-08',
      type: 'standard',
      industry: 'home',
    },
    {
      id: 18,
      title: '设备操作安全规范',
      category: '技术规范',
      date: '2024-03-05',
      type: 'tech',
      industry: 'equipment',
    }
  ];

  const filteredDocuments = documents.filter(doc => 
    (!searchQuery || doc.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
    doc.industry === selectedIndustry &&
    (selectedType === 'all' || doc.type === selectedType)
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">公共数据库</h1>
        <p className="text-sm text-gray-500">行业数据、法律参考资料</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => {
                setIsIndustryOpen(!isIndustryOpen);
                setIsTypeOpen(false);
              }}
              className="flex items-center justify-between w-48 px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span>{industries.find(i => i.id === selectedIndustry)?.name || '选择行业'}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {isIndustryOpen && (
              <div className="absolute z-10 w-48 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="py-1 max-h-60 overflow-auto">
                  {industries.map((industry) => (
                    <button
                      key={industry.id}
                      onClick={() => {
                        setSelectedIndustry(industry.id);
                        setIsIndustryOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        selectedIndustry === industry.id
                          ? 'bg-primary-50 text-primary-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {industry.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setIsTypeOpen(!isTypeOpen);
                setIsIndustryOpen(false);
              }}
              className="flex items-center justify-between w-32 px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span>{documentTypes.find(t => t.id === selectedType)?.name || '文档类型'}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {isTypeOpen && (
              <div className="absolute z-10 w-32 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="py-1">
                  {documentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type.id);
                        setIsTypeOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        selectedType === type.id
                          ? 'bg-primary-50 text-primary-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="搜索文档..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input w-full pl-9 py-1.5 text-sm"
          />
        </div>
      </div>

      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  文档名称
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分类
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  行业
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日期
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {documentTypes.find(t => t.id === doc.type)?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {industries.find(i => i.id === doc.industry)?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(doc.date).toLocaleDateString('zh-CN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PublicDatabase;