import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';

type Chapter = {
  id: string;
  name: string;
  children: Chapter[];
};

type TemplateData = {
  name: string;
  description: string;
  chapters: Chapter[];
};

// 模拟的模板数据，用于编辑模式
const mockTemplateData: { [key: string]: TemplateData } = {
  '1': {
    name: '通用市场分析报告',
    description: '一个标准的市场分析模板，包含行业概览、竞争者分析等。',
    chapters: [
      { id: 'c1', name: '引言', children: [] },
      { id: 'c2', name: '市场概览', children: [
        { id: 'c2.1', name: '市场规模', children: [] },
        { id: 'c2.2', name: '市场趋势', children: [] },
      ]},
      { id: 'c3', name: '结论', children: [] },
    ]
  }
};

const TemplateEditor: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const isEditing = Boolean(templateId);

  useEffect(() => {
    if (isEditing && templateId && mockTemplateData[templateId]) {
      const data = mockTemplateData[templateId];
      setTemplateName(data.name);
      setTemplateDescription(data.description);
      setChapters(data.chapters);
    }
  }, [templateId, isEditing]);
  
  const generateChapterId = () => `c${Date.now()}${Math.random().toString(16).slice(2)}`;

  const addChapter = (parentId: string | null = null) => {
    const newChapter: Chapter = { id: generateChapterId(), name: `新章节`, children: [] };

    const addRecursively = (items: Chapter[]): Chapter[] => {
      if (parentId === null) {
        return [...items, newChapter];
      }
      return items.map(item => {
        if (item.id === parentId) {
          return { ...item, children: [...item.children, newChapter] };
        }
        if (item.children.length > 0) {
          return { ...item, children: addRecursively(item.children) };
        }
        return item;
      });
    };
    
    setChapters(currentChapters => {
        if (parentId === null) {
            return [...currentChapters, newChapter];
        }
        return addRecursively(currentChapters);
    });
  };

  const removeChapter = (chapterId: string) => {
    const removeRecursively = (items: Chapter[]): Chapter[] => {
      return items.filter(item => item.id !== chapterId).map(item => {
        if (item.children.length > 0) {
          return { ...item, children: removeRecursively(item.children) };
        }
        return item;
      });
    };
    setChapters(removeRecursively);
  };
  
  const updateChapterName = (chapterId: string, newName: string) => {
      const updateRecursively = (items: Chapter[]): Chapter[] => {
          return items.map(item => {
              if (item.id === chapterId) {
                  return { ...item, name: newName };
              }
              if (item.children.length > 0) {
                  return { ...item, children: updateRecursively(item.children) };
              }
              return item;
          });
      };
      setChapters(updateRecursively);
  };

  const handleSave = () => {
    console.log({
      id: templateId || `new-${Date.now()}`,
      name: templateName,
      description: templateDescription,
      chapters,
    });
    alert(isEditing ? '模板已更新！' : '模板已创建！');
    navigate('/template-creation');
  };

  const ChapterItem: React.FC<{ chapter: Chapter, prefix: string, level: number }> = ({ chapter, prefix, level }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
      <div className="ml-6">
        <div className="flex items-center group my-1">
           <GripVertical size={18} className="text-gray-400 mr-2 cursor-move" />
           <span className="text-gray-600 font-medium mr-2">{prefix}</span>
           <input 
             type="text"
             value={chapter.name}
             onChange={(e) => updateChapterName(chapter.id, e.target.value)}
             className="flex-grow p-1 rounded-md border border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
           />
           {level < 4 && (
             <button onClick={() => addChapter(chapter.id)} className="ml-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
               <Plus size={16} />
             </button>
           )}
           <button onClick={() => removeChapter(chapter.id)} className="ml-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
             <Trash2 size={16} />
           </button>
           {chapter.children.length > 0 && (
             <button onClick={() => setIsExpanded(!isExpanded)} className="ml-2 text-gray-500">
               {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
             </button>
           )}
        </div>
        {isExpanded && chapter.children.length > 0 && (
          <div>
            {chapter.children.map((child, index) => (
              <ChapterItem key={child.id} chapter={child} prefix={`${prefix}${index + 1}.`} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditing ? '编辑模板' : '新建模板'}
          </h1>
          <div>
            <button
              onClick={() => navigate('/template-creation')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-4"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              保存模板
            </button>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="mb-6">
                <label htmlFor="templateName" className="block text-lg font-medium text-gray-700 mb-2">模板名称</label>
                <input 
                    type="text"
                    id="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="例如：产品需求文档"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            
            <div className="mb-8">
                <label htmlFor="templateDescription" className="block text-lg font-medium text-gray-700 mb-2">模板描述</label>
                <textarea
                    id="templateDescription"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    rows={3}
                    placeholder="简要描述这个模板的用途和包含的内容"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
            </div>

            <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">章节结构</h2>
                <div className="bg-gray-50 p-4 rounded-md border">
                    {chapters.map((chapter, index) => (
                       <ChapterItem key={chapter.id} chapter={chapter} prefix={`${index + 1}.`} level={1} />
                    ))}
                     <button 
                       onClick={() => addChapter(null)}
                       className="mt-4 flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded-md"
                     >
                        <Plus size={16} className="mr-2" />
                        添加一级章节
                     </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor; 