import { ChevronDown, ChevronRight, FolderOpen } from 'lucide-react';
import { useState } from 'react';

interface CategoryListProps {
  activeDatabase: 'public' | 'shared' | 'private';
}

const CategoryList = ({ activeDatabase }: CategoryListProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['legal']);

  const getCategoriesForDatabase = (type: 'public' | 'shared' | 'private') => {
    if (type === 'public') {
      return [
        {
          id: 'legal',
          name: '法律文档',
          count: 245,
          subcategories: [
            { id: 'regulations', name: '法规', count: 112 },
            { id: 'precedents', name: '法律判例', count: 87 },
            { id: 'contracts', name: '合同模板', count: 46 },
          ],
        },
        {
          id: 'industry',
          name: '行业报告',
          count: 187,
          subcategories: [
            { id: 'market', name: '市场分析', count: 93 },
            { id: 'trends', name: '趋势预测', count: 58 },
            { id: 'competitors', name: '竞争对手分析', count: 36 },
          ],
        },
        {
          id: 'tech',
          name: '技术标准',
          count: 92,
          subcategories: [
            { id: 'iso', name: 'ISO标准', count: 34 },
            { id: 'protocols', name: '协议', count: 29 },
            { id: 'best-practices', name: '最佳实践', count: 29 },
          ],
        },
      ];
    } else if (type === 'shared') {
      return [
        {
          id: 'projects',
          name: '项目文档',
          count: 154,
          subcategories: [
            { id: 'planning', name: '规划', count: 67 },
            { id: 'execution', name: '执行', count: 53 },
            { id: 'reviews', name: '评审', count: 34 },
          ],
        },
        {
          id: 'research',
          name: '研究论文',
          count: 89,
          subcategories: [
            { id: 'market-research', name: '市场研究', count: 42 },
            { id: 'competitive', name: '竞争分析', count: 31 },
            { id: 'surveys', name: '调查数据', count: 16 },
          ],
        },
      ];
    } else {
      return [
        {
          id: 'personal',
          name: '个人文档',
          count: 78,
          subcategories: [
            { id: 'notes', name: '笔记和草稿', count: 45 },
            { id: 'research', name: '研究资料', count: 33 },
          ],
        },
        {
          id: 'uploads',
          name: '最近上传',
          count: 42,
          subcategories: [],
        },
      ];
    }
  };

  const categories = getCategoriesForDatabase(activeDatabase);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="card">
      <h3 className="font-medium text-gray-900 mb-3">分类</h3>
      <ul className="space-y-2">
        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          return (
            <li key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <FolderOpen className="mr-2 h-4 w-4 text-gray-400" />
                  <span>{category.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-xs text-gray-500">{category.count}</span>
                  {category.subcategories.length > 0 && (
                    isExpanded ? 
                      <ChevronDown className="h-4 w-4 text-gray-400" /> : 
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </button>
              
              {isExpanded && category.subcategories.length > 0 && (
                <ul className="mt-1 ml-6 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory.id}>
                      <button className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                        <span>{subcategory.name}</span>
                        <span className="text-xs text-gray-500">{subcategory.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryList;