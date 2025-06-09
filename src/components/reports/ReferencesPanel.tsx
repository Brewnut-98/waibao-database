import { Search, Book, Star, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const references = [
  {
    id: 1,
    title: '金融服务监管框架',
    source: '金融监管委员会',
    type: '法律文档',
    relevance: 0.95,
    preview: '该监管框架为金融机构制定了合规要求，包括报告标准、风险管理协议和消费者保护措施。',
  },
  {
    id: 2,
    title: '2024年行业合规基准',
    source: '全球标准研究所',
    type: '研究报告',
    relevance: 0.88,
    preview: '本报告提供了各行业部门合规指标的比较分析，特别关注金融服务、医疗保健和技术领域。',
  },
  {
    id: 3,
    title: '银行业运营风险管理',
    source: '银行监管期刊',
    type: '学术论文',
    relevance: 0.82,
    preview: '本文研究了银行业运营风险管理与监管合规的交叉领域，包含主要金融机构的案例研究。',
  },
  {
    id: 4,
    title: '合规技术实施指南',
    source: '技术合规协会',
    type: '技术指南',
    relevance: 0.79,
    preview: '关于实施合规技术解决方案的综合指南，包括系统要求、集成考虑因素和最佳实践。',
  },
  {
    id: 5,
    title: '监管变化对市场动态的影响',
    source: '市场分析季刊',
    type: '市场报告',
    relevance: 0.75,
    preview: '本分析探讨了近期监管发展如何影响受监管行业的市场行为、竞争定位和战略规划。',
  },
];

const ReferencesPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedReference, setExpandedReference] = useState<number | null>(null);
  
  const filteredReferences = references.filter(ref => 
    ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h3 className="font-medium text-gray-900">知识参考</h3>
        <span className="badge-blue">{references.length} 个来源</span>
      </div>
      
      <div className="mt-4 relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="搜索参考资料..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input w-full pl-10 text-sm py-1.5"
        />
      </div>
      
      <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
        <ul className="space-y-3">
          {filteredReferences.map((reference) => (
            <li 
              key={reference.id} 
              className={`rounded-md border ${
                expandedReference === reference.id 
                  ? 'border-primary-200 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              } p-3 transition-colors duration-200`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <Book className="mt-0.5 h-4 w-4 text-gray-400" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{reference.title}</h4>
                    <p className="text-xs text-gray-500">{reference.source} · {reference.type}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 flex items-center">
                    <span className="text-xs font-medium text-gray-700">{Math.round(reference.relevance * 100)}%</span>
                  </div>
                  <button
                    onClick={() => setExpandedReference(
                      expandedReference === reference.id ? null : reference.id
                    )}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {expandedReference === reference.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {expandedReference === reference.id && (
                <div className="mt-3 pt-3 border-t border-gray-200 animate-fade-in">
                  <p className="text-sm text-gray-600">{reference.preview}</p>
                  <div className="mt-2 flex justify-between">
                    <button className="text-xs text-primary-600 hover:text-primary-700">
                      <Star className="mr-1 inline-block h-3 w-3" />
                      添加到收藏
                    </button>
                    <button className="text-xs text-primary-600 hover:text-primary-700">
                      查看完整来源
                      <ExternalLink className="ml-1 inline-block h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        
        {filteredReferences.length === 0 && (
          <div className="py-6 text-center">
            <p className="text-sm text-gray-500">未找到匹配的参考资料。</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="btn-outline w-full text-sm py-1.5">
          搜索知识库
        </button>
      </div>
    </div>
  );
};

export default ReferencesPanel;