import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

// 模拟的模板数据
const mockTemplates = [
  { id: '1', name: '通用市场分析报告', description: '一个标准的市场分析模板，包含行业概览、竞争者分析等。', type: '报告' },
  { id: '2', name: '产品需求文档 (PRD)', description: '用于规划新功能和产品的详细文档模板。', type: '通用文档' },
  { id: '3', name: '社交媒体内容日历', description: '规划和安排社交媒体帖子的模板。', type: '数据分析' },
  { id: '4', name: '项目启动会议纪要', description: '记录项目启动会议关键决策和行动项的模板。', type: '通用文档' },
];

const TemplateList: React.FC = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">模板库</h1>
        <Link
          to="/template/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          新建模板
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTemplates.map((template) => (
          <Link to={`/template/edit/${template.id}`} key={template.id}>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer h-full flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h2>
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              </div>
              <div className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full self-start">
                {template.type}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TemplateList; 