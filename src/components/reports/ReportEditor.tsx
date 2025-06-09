import { useEffect, useState } from 'react';
import { Check, ChevronDown, Edit2, Save, X } from 'lucide-react';

interface ReportEditorProps {
  topic: string;
}

const ReportEditor = ({ topic }: ReportEditorProps) => {
  const [sections, setSections] = useState<{id: number, title: string, content: string}[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (!topic) return;
    
    const generatedSections = [
      {
        id: 1,
        title: '执行摘要',
        content: `本报告提供了关于${topic}的全面分析。主要发现表明监管框架、市场动态和组织影响方面有重大发展。以下各节详细说明了我们基于当前数据的分析和建议。`,
      },
      {
        id: 2,
        title: '引言',
        content: `${topic}的格局在近年来发生了显著变化。本报告基于我们广泛的行业数据、法律框架和组织最佳实践知识库，研究了当前趋势、挑战和机遇。`,
      },
      {
        id: 3,
        title: '主要发现',
        content: `我们对${topic}的分析揭示了几个关键见解：\n\n1. 监管框架越来越注重透明度和问责制。\n\n2. 组织在保持合规的同时优化运营效率方面面临重大挑战。\n\n3. 市场领导者采用了创新方法来应对新兴要求。\n\n4. 技术解决方案在管理复杂监管环境中发挥关键作用。`,
      },
      {
        id: 4,
        title: '分析',
        content: `## 市场趋势\n\n${topic}解决方案市场在过去五年以12.5%的年复合增长率增长。这种增长由监管复杂性增加和对综合合规管理系统的需求推动。\n\n## 监管发展\n\n近期立法为组织引入了新的要求，特别是在数据管理、报告和治理结构方面。这些变化需要重新评估当前的合规策略。\n\n## 组织影响\n\n实施健全的${topic}框架的组织报告合规相关事件减少28%，相关成本降低15%。`,
      },
      {
        id: 5,
        title: '建议',
        content: `基于我们的分析，我们建议采取以下行动：\n\n1. **战略评估**：对当前合规框架进行全面审查。\n\n2. **技术集成**：实施自动化监控和报告系统。\n\n3. **培训与发展**：通过专业培训项目提升员工能力。\n\n4. **跨职能协作**：建立涵盖法律、运营和IT部门的专门团队。\n\n5. **持续改进**：制定指标和反馈机制以完善合规流程。`,
      },
      {
        id: 6,
        title: '结论',
        content: `${topic}不断发展的格局为组织带来了挑战和机遇。通过采用主动、综合的合规方法，企业不仅可以降低风险，还可以通过提高运营效率和利益相关者信任来创造竞争优势。`,
      },
    ];
    
    setSections(generatedSections);
    setActiveSectionId(generatedSections[0].id);
  }, [topic]);

  const handleEditSection = () => {
    if (activeSectionId === null) return;
    
    const section = sections.find(s => s.id === activeSectionId);
    if (section) {
      setEditContent(section.content);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (activeSectionId === null) return;
    
    setSections(sections.map(section => 
      section.id === activeSectionId 
        ? { ...section, content: editContent } 
        : section
    ));
    
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="mt-4">
      <div className="mb-6 rounded-md bg-gray-50 p-4">
        <h3 className="font-medium text-gray-900">目录</h3>
        <ul className="mt-2 space-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => setActiveSectionId(section.id)}
                className={`text-left text-sm ${
                  activeSectionId === section.id
                    ? 'font-medium text-primary-700'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {activeSectionId !== null && (
        <div>
          {!isEditing ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-medium text-gray-900">
                  {sections.find(s => s.id === activeSectionId)?.title}
                </h2>
                <button
                  onClick={handleEditSection}
                  className="flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <Edit2  className="mr-1.5 h-4 w-4" />
                  编辑章节
                </button>
              </div>
              
              <div className="prose prose-sm max-w-none">
                {sections.find(s => s.id === activeSectionId)?.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2">
                <button className="badge-blue">
                  <span className="mr-1 text-xs">[1]</span>
                  参考资料
                </button>
                <button className="badge-blue">
                  <span className="mr-1 text-xs">[2]</span>
                  参考资料
                </button>
                <button className="badge-blue">
                  <span className="mr-1 text-xs">[3]</span>
                  参考资料
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-medium text-gray-900">
                  正在编辑：{sections.find(s => s.id === activeSectionId)?.title}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <X className="mr-1.5 h-4 w-4" />
                    取消
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center rounded-md bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 shadow-sm ring-1 ring-inset ring-primary-300 hover:bg-primary-100"
                  >
                    <Check className="mr-1.5 h-4 w-4" />
                    保存
                  </button>
                </div>
              </div>
              
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="form-input min-h-[300px] w-full"
                placeholder="编辑章节内容..."
              />
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              disabled={activeSectionId === 1}
              onClick={() => {
                if (activeSectionId > 1) {
                  setActiveSectionId(activeSectionId - 1);
                }
              }}
              className="btn-outline py-1 disabled:opacity-50"
            >
              上一章节
            </button>
            <button
              disabled={activeSectionId === sections.length}
              onClick={() => {
                if (activeSectionId < sections.length) {
                  setActiveSectionId(activeSectionId + 1);
                }
              }}
              className="btn-primary py-1 disabled:opacity-50"
            >
              下一章节
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportEditor;