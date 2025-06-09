import { useState } from 'react';
import { FileText, Filter, FolderOpen, Search, SlidersHorizontal, Check } from 'lucide-react';
import CategoryList from '../components/knowledgeBase/CategoryList';
import DocumentGrid from '../components/knowledgeBase/DocumentGrid';

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const documentTypes = ['法律法规', '行业标准', '技术规范'];
  const industries = [
    '家居行业',
    '建材行业',
    '电子原件和电子专用材料制造行业',
    '电器机械和器材制造行业',
    '通用设备制造行业',
    '专业实验室及研发实验基地类',
    '塑料制品行业',
    '医院行业'
  ];

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">知识库</h1>
          <p className="text-sm text-gray-500">访问和管理所有知识资源</p>
        </div>
        
        <div className="flex space-x-2">
          <button className="btn-outline">
            <FolderOpen className="mr-2 h-4 w-4" />
            浏览
          </button>
          <button className="btn-primary">
            <FileText className="mr-2 h-4 w-4" />
            新建文档
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="搜索文档、卡片、表格..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input w-full pl-10"
          />
        </div>
        <button 
          className={`btn-outline flex items-center ${showFilters ? 'bg-gray-100' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          筛选
        </button>
      </div>

      {showFilters && (
        <div className="card animate-slide-up">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">文档类型</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {documentTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                      selectedTypes.includes(type)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900">{type}</span>
                    {selectedTypes.includes(type) && (
                      <Check className="h-5 w-5 text-primary-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">行业</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => toggleIndustry(industry)}
                    className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                      selectedIndustries.includes(industry)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900">{industry}</span>
                    {selectedIndustries.includes(industry) && (
                      <Check className="h-5 w-5 text-primary-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button 
                onClick={() => {
                  setSelectedTypes([]);
                  setSelectedIndustries([]);
                }}
                className="btn-outline"
              >
                重置筛选
              </button>
              <button className="btn-primary">
                应用筛选
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <CategoryList activeDatabase="public" />
        </div>
        <div className="md:col-span-3">
          <DocumentGrid 
            activeDatabase="public" 
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;