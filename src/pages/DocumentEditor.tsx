import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  FileText,
  Plus,
  MoreHorizontal,
  Edit3,
  Send,
  Bot,
  User,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  BookOpen,
  Table,
  BarChart3,
  Calculator,
  GitBranch,
  X,
  Search,
  Filter,
  Check,
  Copy,
  RotateCcw,
  Maximize2,
  Minimize2,
  GripHorizontal
} from 'lucide-react';
import FormulaEditor from '../components/FormulaEditor';
import FlowchartEditor from '../components/FlowchartEditor';

interface Section {
  id: string;
  title: string;
  content: string;
  level: number;
  children?: Section[];
  generatedContent?: GeneratedContent[];
  isGenerated?: boolean;
}

interface GeneratedContent {
  id: string;
  content: string;
  sourceCards: ReferenceCard[];
  timestamp: Date;
  type: 'ai_generated' | 'user_written';
}

interface ReferenceCard {
  id: string;
  title: string;
  content: string;
  source: string;
  type: 'text' | 'table' | 'chart' | 'formula';
  relevanceScore?: number;
  tags: string[];
  category: string;
  summary: string;
  sourcePageNumber: number;
  confidence: number;
  aiProcessed: boolean;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sourceCards?: ReferenceCard[];
}

const DocumentEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { documentId } = useParams();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 从路由状态获取项目信息
  const { projectId, templateId, mode } = location.state || {};

  // 根据模板ID获取文档标题
  const getDocumentTitle = () => {
    if (templateId) {
      const templateTitles: { [key: string]: string } = {
        '1': '建设项目环境影响报告书',
        '2': '建设项目环境影响报告表',
        '3': '环境影响登记表',
        '4': '水土保持方案报告书',
        '5': '安全评价报告',
        '6': '职业病危害预评价',
        '7': '家居制造业环评报告',
        '8': '医院建设项目环评',
        '9': '塑料制品安全评价'
      };
      return templateTitles[templateId] || '新建文档';
    }
    return mode === 'edit' ? '编辑文档' : '新建文档';
  };

  // 文档状态
  const [documentTitle, setDocumentTitle] = useState(getDocumentTitle());
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      title: '一、建设内容',
      content: '本章节主要介绍项目的建设内容和基本情况...',
      level: 1,
      children: [
        {
          id: '1-1',
          title: '1.项目由来',
          content: '项目建设的背景、必要性和可行性...',
          level: 2
        },
        {
          id: '1-2',
          title: '2.项目概况',
          content: '项目的基本概况和整体规划...',
          level: 2,
          children: [
            {
              id: '1-2-1',
              title: '2.1实施地址及周边概况',
              content: '项目实施地址的详细信息及周边环境概况...',
              level: 3,
              children: [
                {
                  id: '1-2-1-1',
                  title: '2.1.1 地理位置',
                  content: '项目具体地理位置坐标和行政区划...',
                  level: 4
                },
                {
                  id: '1-2-1-2',
                  title: '2.1.2 周边环境敏感目标',
                  content: '项目周边的环境敏感目标分布情况...',
                  level: 4
                }
              ]
            },
            {
              id: '1-2-2',
              title: '2.2项目内容、规模',
              content: '项目建设内容和建设规模...',
              level: 3,
              children: [
                {
                  id: '1-2-2-1',
                  title: '2.2.1 建设规模',
                  content: '项目建设的具体规模和建筑面积...',
                  level: 4
                },
                {
                  id: '1-2-2-2',
                  title: '2.2.2 建设内容',
                  content: '项目建设的主要内容和功能分区...',
                  level: 4
                }
              ]
            },
            {
              id: '1-2-3',
              title: '2.3项目主要原辅材料',
              content: '项目生产过程中使用的主要原辅材料...',
              level: 3
            },
            {
              id: '1-2-4',
              title: '2.4项目生产设备',
              content: '项目主要生产设备清单和技术参数...',
              level: 3
            },
            {
              id: '1-2-5',
              title: '2.5平面布置',
              content: '项目总平面布置及功能分区...',
              level: 3
            },
            {
              id: '1-2-6',
              title: '2.6 定员与生产特点',
              content: '项目劳动定员情况及生产特点...',
              level: 3
            },
            {
              id: '1-2-7',
              title: '2.7公用工程',
              content: '项目配套的公用工程设施...',
              level: 3
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: '二、工艺流程和产排污环节',
      content: '本章节分析项目的工艺流程及各环节的产排污情况...',
      level: 1,
      children: [
        {
          id: '2-1',
          title: '1.运营期实施方案',
          content: '项目运营期的具体实施方案和计划...',
          level: 2
        },
        {
          id: '2-2',
          title: '2.运营期主要污染工序',
          content: '运营期各工序的污染物产生及排放情况...',
          level: 2
        }
      ]
    },
    {
      id: '3',
      title: '三、与项目有关的原有环境污染问题',
      content: '本章节分析与项目有关的原有环境污染问题...',
      level: 1,
      children: [
        {
          id: '3-1',
          title: '1.企业现有项目审批及实施情况',
          content: '企业现有项目的环保审批及实施情况...',
          level: 2
        },
        {
          id: '3-2',
          title: '2.企业原审批工程及主要设备',
          content: '企业原有审批工程的基本情况及主要设备...',
          level: 2
        },
        {
          id: '3-3',
          title: '3.企业原审批工程原辅材料消耗',
          content: '原审批工程的原辅材料使用情况...',
          level: 2
        },
        {
          id: '3-4',
          title: '4.企业原审批工程工艺流程',
          content: '原审批工程的工艺流程及产污环节...',
          level: 2
        },
        {
          id: '3-5',
          title: '5.企业原审批工程环环保措施概况',
          content: '原审批工程已采取的环保措施情况...',
          level: 2
        },
        {
          id: '3-6',
          title: '6.现有污染源及达标性分析',
          content: '现有污染源排放情况及达标性分析...',
          level: 2
        },
        {
          id: '3-7',
          title: '7.企业原审批项目污染物源强汇总及总量控制指标',
          content: '原审批项目污染物源强统计及总量控制要求...',
          level: 2
        },
        {
          id: '3-8',
          title: '8.企业现状环保问题及改进建议',
          content: '企业现状存在的环保问题及改进建议...',
          level: 2
        }
      ]
    }
  ]);

  const [activeSection, setActiveSection] = useState<string>('1');
  const [expandedSections, setExpandedSections] = useState<string[]>(['1', '1-2', '1-2-1', '1-2-2', '2', '3']);

  // 模拟参考资料卡片数据
  const [referenceCards] = useState<ReferenceCard[]>([
    {
      id: 'card_1',
      title: '环境影响评价技术导则',
      content: '建设项目环境影响评价应当遵循以下原则：依法评价、科学评价、突出重点、注重实效...',
      source: '环评技术导则.pdf',
      type: 'text',
      relevanceScore: 0.95,
      tags: ['环评', '技术导则', '评价原则'],
      category: '技术规范',
      summary: '环境影响评价的基本原则和技术要求',
      sourcePageNumber: 1,
      confidence: 0.95,
      aiProcessed: true
    },
    {
      id: 'card_2',
      title: '项目基本信息表',
      content: '项目名称：某工业园区建设项目\n建设单位：XX环保科技有限公司\n建设地点：XX市XX区...',
      source: '项目申报材料.docx',
      type: 'text',
      relevanceScore: 0.88,
      tags: ['项目信息', '基本资料', '申报材料'],
      category: '项目资料',
      summary: '项目的基本信息和建设单位情况',
      sourcePageNumber: 3,
      confidence: 0.88,
      aiProcessed: true
    },
    {
      id: 'card_3',
      title: '环境质量现状监测数据',
      content: 'PM2.5: 35μg/m³\nPM10: 68μg/m³\nSO2: 15μg/m³\nNO2: 42μg/m³...',
      source: '监测报告.xlsx',
      type: 'table',
      relevanceScore: 0.82,
      tags: ['监测数据', '环境质量', '大气污染'],
      category: '监测数据',
      summary: '项目区域环境质量现状监测结果',
      sourcePageNumber: 15,
      confidence: 0.82,
      aiProcessed: true
    },
    {
      id: 'card_4',
      title: '项目地理位置图',
      content: '项目位于XX市XX区，东临XX路，西接XX河，南靠XX工业园...',
      source: '地理位置图.jpg',
      type: 'chart',
      relevanceScore: 0.76,
      tags: ['地理位置', '项目选址', '周边环境'],
      category: '地理信息',
      summary: '项目地理位置和周边环境情况',
      sourcePageNumber: 5,
      confidence: 0.76,
      aiProcessed: true
    }
  ]);

  // 聊天状态
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '你好！我是你的写作助手。我已经为您生成了初始内容，以下是生成当前章节时使用的参考资料：',
      timestamp: new Date(),
      sourceCards: referenceCards.filter(card => card.relevanceScore && card.relevanceScore > 0.7)
    },
    {
      id: '2',
      type: 'assistant',
      content: '我可以帮助你：\n\n• 基于参考资料生成章节内容\n• 优化文字表达\n• 查找相关资料卡片\n• 提供专业建议\n\n有什么需要帮助的吗？',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // AI模式状态
  const [aiMode, setAiMode] = useState<'question' | 'search' | 'edit'>('question');
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  // 源强分析浮窗状态
  const [showSourceAnalysisModal, setShowSourceAnalysisModal] = useState(false);

  // 新增状态
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  const [selectedText, setSelectedText] = useState<string>('');

  // 编辑状态
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitleValue, setEditingTitleValue] = useState(documentTitle);

  // 右侧边栏tab状态 - 移除tab切换，改为上下分割
  // const [rightSidebarTab, setRightSidebarTab] = useState<'references' | 'chat'>('chat');

  // 新增状态：选中的参考资料内容
  const [selectedReferenceContent, setSelectedReferenceContent] = useState<string>('');
  const [selectedReferenceCard, setSelectedReferenceCard] = useState<ReferenceCard | null>(null);

  // 新增状态：多选参考资料卡片
  const [selectedReferenceCards, setSelectedReferenceCards] = useState<ReferenceCard[]>([]);

  // 新增状态：AI生成对比模式
  const [showDiffMode, setShowDiffMode] = useState(false);
  const [originalContent, setOriginalContent] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  // 新增状态：右侧面板尺寸控制
  const [rightPanelSizes, setRightPanelSizes] = useState({
    references: 60, // 参考资料区域占右侧面板的百分比
    chat: 40 // AI助手区域占右侧面板的百分比
  });

  // 新增状态：参考资料筛选和搜索
  const [referenceFilter, setReferenceFilter] = useState({
    type: 'all' as 'all' | 'text' | 'table' | 'chart' | 'formula',
    category: 'all' as string,
    searchQuery: ''
  });

  // 新增状态：左侧目录宽度
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(224); // 默认 w-56 = 224px

  // 编辑器工具栏状态
  const [editorToolbar, setEditorToolbar] = useState({
    bold: false,
    italic: false,
    underline: false,
    fontSize: '14',
    textAlign: 'left' as 'left' | 'center' | 'right'
  });

  // 编辑器模态框状态
  const [showFormulaEditor, setShowFormulaEditor] = useState(false);
  const [showFlowchartEditor, setShowFlowchartEditor] = useState(false);
  
  // 目录项编辑和菜单状态
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState('');
  const [sectionMenuId, setSectionMenuId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [editingTags, setEditingTags] = useState<string[]>([]);



  // 获取当前激活的章节
  const getCurrentSection = (): Section | undefined => {
    const findSection = (sections: Section[]): Section | undefined => {
      for (const section of sections) {
        if (section.id === activeSection) return section;
        if (section.children) {
          const found = findSection(section.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findSection(sections);
  };

  // 自动生成章节内容
  const generateSectionContent = async (sectionId: string) => {
    setIsGeneratingContent(true);

    // 模拟AI生成过程
    setTimeout(() => {
      const relevantCards = referenceCards.filter(card => card.relevanceScore && card.relevanceScore > 0.7);
      const generatedContent = generateContentBasedOnCards(sectionId, relevantCards);

      // 更新章节内容
      const updateSection = (sections: Section[]): Section[] => {
        return sections.map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              content: generatedContent.content,
              isGenerated: true,
              generatedContent: [generatedContent]
            };
          }
          if (section.children) {
            return { ...section, children: updateSection(section.children) };
          }
          return section;
        });
      };

      setSections(updateSection(sections));
      setIsGeneratingContent(false);

      // 添加生成消息到聊天
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `已为"${getCurrentSection()?.title}"章节生成内容，参考了${relevantCards.length}个相关资料。`,
        timestamp: new Date(),
        sourceCards: relevantCards
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    }, 2000);
  };

  // 基于卡片生成内容
  const generateContentBasedOnCards = (sectionId: string, cards: ReferenceCard[]): GeneratedContent => {
    const sectionTemplates: { [key: string]: string } = {
      '1': `根据项目基本信息，本项目为${cards.find(c => c.category === '项目资料')?.content.split('\n')[0] || '建设项目'}。

项目建设的主要目的是满足区域发展需求，提升环境保护水平。根据相关技术导则要求，本次环境影响评价将严格按照国家相关法规和标准进行。

参考资料显示：${cards.map(c => c.title).join('、')}等文件为本次评价提供了重要依据。`,

      '2': `根据现场调查和监测数据分析，项目所在区域环境质量现状如下：

大气环境：${cards.find(c => c.type === 'table')?.content || '各项指标均符合环境质量标准要求'}

地理位置：${cards.find(c => c.type === 'chart')?.content || '项目地理位置优越，周边环境良好'}

本次现状调查严格按照相关技术规范执行，数据真实可靠。`,

      '3': `基于工程分析和环境现状调查结果，预测项目建设和运营期间的环境影响：

1. 大气环境影响预测
根据监测数据和技术导则要求，项目排放的污染物对周边环境影响较小。

2. 水环境影响预测
项目废水经处理后达标排放，对水环境影响可接受。

3. 声环境影响预测
项目运营期噪声经治理后能够满足相关标准要求。`
    };

    return {
      id: `gen_${Date.now()}`,
      content: sectionTemplates[sectionId] || `基于参考资料生成的${getCurrentSection()?.title}内容...`,
      sourceCards: cards,
      timestamp: new Date(),
      type: 'ai_generated'
    };
  };

  // 更新章节内容
  const updateSectionContent = (content: string) => {
    const updateSection = (sections: Section[]): Section[] => {
      return sections.map(section => {
        if (section.id === activeSection) {
          return { ...section, content };
        }
        if (section.children) {
          return { ...section, children: updateSection(section.children) };
        }
        return section;
      });
    };
    setSections(updateSection(sections));
  };

  // 切换章节展开状态
  const toggleSectionExpanded = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // 添加新章节
  const addNewSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: `${sections.length + 1}. 新章节`,
      content: '',
      level: 1
    };
    setSections(prev => [...prev, newSection]);
    setActiveSection(newSection.id);
  };

  // 添加子章节 - 支持4级层级
  const addSubSection = (parentId: string) => {
    const findParentSection = (sections: Section[], targetId: string): Section | null => {
      for (const section of sections) {
        if (section.id === targetId) return section;
        if (section.children) {
          const found = findParentSection(section.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const parentSection = findParentSection(sections, parentId);
    if (!parentSection) return;

    const updateSections = (sections: Section[]): Section[] => {
      return sections.map(section => {
        if (section.id === parentId) {
          const currentLevel = section.level;
          const childCount = section.children?.length || 0;
          let newTitle = '';
          
          // 根据层级生成不同格式的标题
          switch (currentLevel) {
            case 1:
              newTitle = `${childCount + 1}.新子章节`;
              break;
            case 2:
              const parentNumber = section.title.split('.')[0];
              newTitle = `${parentNumber}.${childCount + 1} 新子章节`;
              break;
            case 3:
              const parentParts = section.title.split(' ')[0].split('.');
              newTitle = `${parentParts[0]}.${parentParts[1]}.${childCount + 1} 新子章节`;
              break;
            default:
              newTitle = `新子章节 ${childCount + 1}`;
          }

          const newSubSection: Section = {
            id: `${parentId}-${Date.now()}`,
            title: newTitle,
            content: '',
            level: Math.min(currentLevel + 1, 4) // 限制最大4级
          };
          
          return {
            ...section,
            children: [...(section.children || []), newSubSection]
          };
        }
        if (section.children) {
          return { ...section, children: updateSections(section.children) };
        }
        return section;
      });
    };
    
    setSections(updateSections(sections));
    setExpandedSections(prev => [...prev, parentId]);
  };

  // 开始编辑章节标题
  const startEditingSection = (sectionId: string, currentTitle: string) => {
    setEditingSectionId(sectionId);
    setEditingSectionTitle(currentTitle);
    setSectionMenuId(null);
  };

  // 保存章节标题编辑
  const saveEditingSection = () => {
    if (!editingSectionId || !editingSectionTitle.trim()) return;
    
    const updateSection = (sections: Section[]): Section[] => {
      return sections.map(section => {
        if (section.id === editingSectionId) {
          return { ...section, title: editingSectionTitle.trim() };
        }
        if (section.children) {
          return { ...section, children: updateSection(section.children) };
        }
        return section;
      });
    };
    
    setSections(updateSection(sections));
    setEditingSectionId(null);
    setEditingSectionTitle('');
  };

  // 取消编辑章节标题
  const cancelEditingSection = () => {
    setEditingSectionId(null);
    setEditingSectionTitle('');
  };

  // 删除章节
  const deleteSection = (sectionId: string) => {
    if (confirm('确认删除此章节及其所有子章节吗？此操作不可撤销。')) {
      const updateSections = (sections: Section[]): Section[] => {
        return sections.filter(section => {
          if (section.id === sectionId) return false;
          if (section.children) {
            section.children = updateSections(section.children);
          }
          return true;
        });
      };
      
      setSections(updateSections(sections));
      
      // 如果删除的是当前选中章节，切换到第一个章节
      if (activeSection === sectionId) {
        const remainingSections = updateSections(sections);
        if (remainingSections.length > 0) {
          setActiveSection(remainingSections[0].id);
        }
      }
      
      setSectionMenuId(null);
    }
  };

  // 编辑器工具栏功能
  const applyFormat = (format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let newText = '';

    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        setEditorToolbar(prev => ({ ...prev, bold: !prev.bold }));
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        setEditorToolbar(prev => ({ ...prev, italic: !prev.italic }));
        break;
      case 'underline':
        newText = `<u>${selectedText}</u>`;
        setEditorToolbar(prev => ({ ...prev, underline: !prev.underline }));
        break;
      case 'list':
        newText = selectedText.split('\n').map(line => line.trim() ? `• ${line}` : line).join('\n');
        break;
      case 'orderedList':
        newText = selectedText.split('\n').map((line, index) => line.trim() ? `${index + 1}. ${line}` : line).join('\n');
        break;
      case 'quote':
        newText = selectedText.split('\n').map(line => line.trim() ? `> ${line}` : line).join('\n');
        break;
      case 'link':
        const url = prompt('请输入链接地址:');
        if (url) {
          newText = `[${selectedText || '链接文本'}](${url})`;
        } else {
          return;
        }
        break;
      case 'heading':
        newText = `## ${selectedText}`;
        break;
      default:
        return;
    }

    const newContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    updateSectionContent(newContent);

    // 重新设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  // 插入内容
  const insertContent = (content: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const currentContent = textarea.value;
    const newContent = currentContent.substring(0, start) + content + currentContent.substring(start);

    updateSectionContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + content.length, start + content.length);
    }, 0);
  };

  // 插入表格
  const insertTable = () => {
    const defaultTable = `
| 标题1 | 标题2 | 标题3 |
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |
`;
    insertContent(defaultTable);
  };

  // 插入公式
  const insertFormula = () => {
    setEditingContent('');
    setEditingTitle('新公式');
    setEditingTags([]);
    setShowFormulaEditor(true);
  };

  // 插入流程图
  const insertFlowchart = () => {
    setEditingContent('');
    setEditingTitle('新流程图');
    setEditingTags([]);
    setShowFlowchartEditor(true);
  };



  // 更新公式编辑器的onChange处理
  const handleFormulaChange = (content: string) => {
    setEditingContent(content);
  };

  // 更新流程图编辑器的onChange处理
  const handleFlowchartChange = (content: string) => {
    setEditingContent(content);
  };

  // 公式编辑器关闭处理
  const handleFormulaClose = () => {
    if (editingContent.trim()) {
      insertContent(`\n公式：${editingContent}\n`);
    }
    setShowFormulaEditor(false);
  };

  // 流程图编辑器关闭处理
  const handleFlowchartClose = () => {
    if (editingContent.trim()) {
      insertContent(`\n流程图：${editingContent}\n`);
    }
    setShowFlowchartEditor(false);
  };

  // 处理文本选择
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedContent = selection.toString().trim();
      if (selectedContent.length > 0 && selectedContent.length <= 200) { // 限制选中文本长度
        setSelectedText(selectedContent);
      }
    }
  };

  // 清除选中文本
  const clearSelectedText = () => {
    setSelectedText('');
  };

  // 处理参考资料内容选择
  const handleReferenceContentSelection = (card: ReferenceCard, content: string) => {
    setSelectedReferenceCard(card);
    setSelectedReferenceContent(content);
  };

  // 筛选参考资料
  const getFilteredReferenceCards = () => {
    return referenceCards.filter(card => {
      // 类型筛选
      if (referenceFilter.type !== 'all' && card.type !== referenceFilter.type) {
        return false;
      }

      // 分类筛选
      if (referenceFilter.category !== 'all' && card.category !== referenceFilter.category) {
        return false;
      }

      // 搜索筛选
      if (referenceFilter.searchQuery) {
        const query = referenceFilter.searchQuery.toLowerCase();
        const searchText = `${card.title} ${card.content} ${card.tags.join(' ')}`.toLowerCase();
        if (!searchText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  };

  // 获取所有分类
  const getAllCategories = () => {
    const categories = Array.from(new Set(referenceCards.map(card => card.category)));
    return ['all', ...categories];
  };

  // 调整右侧面板尺寸
  const handlePanelResize = (newReferencesHeight: number) => {
    const newSizes = {
      references: Math.max(20, Math.min(80, newReferencesHeight)),
      chat: Math.max(20, Math.min(80, 100 - newReferencesHeight))
    };
    setRightPanelSizes(newSizes);
  };

  // 多选卡片处理
  const toggleCardSelection = (card: ReferenceCard) => {
    setSelectedReferenceCards(prev => {
      const isSelected = prev.some(c => c.id === card.id);
      if (isSelected) {
        return prev.filter(c => c.id !== card.id);
      } else {
        return [...prev, card];
      }
    });
  };

  // 清除所有选择
  const clearAllSelections = () => {
    setSelectedText('');
    setSelectedReferenceCard(null);
    setSelectedReferenceContent('');
    setSelectedReferenceCards([]);
  };





  // 发送聊天消息 - 增强版，支持多选
  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || chatInput;
    if (!messageToSend.trim()) return;

    // 构建消息内容，支持多种选择类型
    let fullMessage = messageToSend;
    let contextInfo = '';

    if (selectedText) {
      contextInfo += `选中的编辑器文本："${selectedText}"`;
    }

    if (selectedReferenceCard) {
      if (contextInfo) contextInfo += '，';
      contextInfo += `参考资料"${selectedReferenceCard.title}"`;
      if (selectedReferenceContent) {
        contextInfo += `中的内容："${selectedReferenceContent}"`;
      }
    }

    if (selectedReferenceCards.length > 0) {
      if (contextInfo) contextInfo += '，';
      contextInfo += `多个参考资料：${selectedReferenceCards.map(card => `"${card.title}"`).join('、')}`;
    }

    if (contextInfo) {
      fullMessage = `关于${contextInfo}，${messageToSend}`;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: fullMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    // 发送后清除选中内容（可选，用户可能想保持选择状态）
    // setSelectedText('');
    // setSelectedReferenceCard(null);
    // setSelectedReferenceContent('');
    // setSelectedReferenceCards([]);
    setIsTyping(true);

    // 模拟AI回复 - 考虑当前选择状态
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageToSend, {
        selectedText,
        selectedReferenceCard,
        selectedReferenceCards,
        selectedReferenceContent
      });
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        sourceCards: aiResponse.sourceCards
      };
      setChatMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // 查找相关卡片
  const findRelevantCards = (query: string): ReferenceCard[] => {
    const keywords = query.toLowerCase().split(' ');
    return referenceCards.filter(card => {
      const searchText = `${card.title} ${card.content}`.toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword));
    }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  };

  // 生成AI回复 - 增强版，支持上下文感知
  const generateAIResponse = (
    input: string,
    context?: {
      selectedText?: string;
      selectedReferenceCard?: ReferenceCard | null;
      selectedReferenceCards?: ReferenceCard[];
      selectedReferenceContent?: string;
    }
  ): { content: string; sourceCards?: ReferenceCard[] } => {
    const query = input.toLowerCase();
    const hasContext = context && (
      context.selectedText ||
      context.selectedReferenceCard ||
      (context.selectedReferenceCards && context.selectedReferenceCards.length > 0)
    );

    // 基于上下文的智能回复
    if (hasContext && context) {
      // 处理多选资料的情况
      if (context.selectedReferenceCards && context.selectedReferenceCards.length > 0) {
        if (query.includes('综合') || query.includes('生成') || query.includes('整合')) {
          return {
            content: `我将基于您选择的${context.selectedReferenceCards.length}个参考资料为您生成综合内容：\n\n` +
              `参考资料：${context.selectedReferenceCards.map(card => card.title).join('、')}\n\n` +
              `根据这些资料，我建议从以下几个方面展开：\n` +
              `1. 整合各资料的核心观点\n` +
              `2. 分析资料间的关联性\n` +
              `3. 形成完整的论述结构\n\n` +
              `请告诉我您希望重点关注哪个方面？`,
            sourceCards: context.selectedReferenceCards
          };
        }

        if (query.includes('关联') || query.includes('分析')) {
          return {
            content: `我来分析这${context.selectedReferenceCards.length}个资料之间的关联性：\n\n` +
              context.selectedReferenceCards.map((card, index) =>
                `${index + 1}. ${card.title} (${card.category})`
              ).join('\n') +
              `\n\n这些资料的共同点：\n• 都涉及${context.selectedReferenceCards[0].category}领域\n• 可以相互补充和验证\n• 为文档提供多角度支撑`,
            sourceCards: context.selectedReferenceCards
          };
        }
      }

      // 处理单选资料的情况
      if (context.selectedReferenceCard) {
        if (query.includes('生成') || query.includes('写')) {
          return {
            content: `基于参考资料"${context.selectedReferenceCard.title}"，我为您生成以下内容：\n\n` +
              `[根据${context.selectedReferenceCard.category}类型的资料特点，生成相应的专业内容]\n\n` +
              `这段内容结合了资料中的关键信息，您可以根据需要进行调整。需要我进一步优化吗？`,
            sourceCards: [context.selectedReferenceCard]
          };
        }

        if (query.includes('解释') || query.includes('说明')) {
          return {
            content: `关于参考资料"${context.selectedReferenceCard.title}"的关键信息：\n\n` +
              `• 资料类型：${context.selectedReferenceCard.type}\n` +
              `• 所属分类：${context.selectedReferenceCard.category}\n` +
              `• 置信度：${Math.round(context.selectedReferenceCard.confidence * 100)}%\n\n` +
              `主要内容概述：${context.selectedReferenceCard.summary}\n\n` +
              `这个资料可以为您的文档提供${context.selectedReferenceCard.category}方面的支撑。`,
            sourceCards: [context.selectedReferenceCard]
          };
        }
      }

      // 处理选中文本的情况
      if (context.selectedText) {
        if (query.includes('优化') || query.includes('改进')) {
          return {
            content: `我来帮您优化这段文本：\n\n原文：\n"${context.selectedText}"\n\n优化建议：\n` +
              `1. 语言表达更加专业准确\n2. 逻辑结构更加清晰\n3. 增加必要的细节说明\n\n` +
              `优化后的版本：\n[基于原文内容进行专业化改写]\n\n您觉得这样的调整如何？`,
            sourceCards: []
          };
        }

        if (query.includes('检查') || query.includes('语法')) {
          return {
            content: `我检查了您选中的文本，发现以下几点：\n\n` +
              `✅ 语法结构正确\n✅ 逻辑表达清晰\n\n` +
              `改进建议：\n• 可以增加更多专业术语\n• 建议补充相关数据支撑\n• 考虑添加引用来源\n\n` +
              `需要我帮您查找相关的参考资料吗？`,
            sourceCards: []
          };
        }
      }
    }

    // 检查是否是查找资料的请求
    if (query.includes('查找') || query.includes('搜索') || query.includes('资料') || query.includes('参考')) {
      const relevantCards = findRelevantCards(input);
      if (relevantCards.length > 0) {
        return {
          content: `我找到了${relevantCards.length}个相关资料：\n\n${relevantCards.slice(0, 3).map(card =>
            `• ${card.title}\n  来源：${card.source}\n  相关度：${Math.round((card.relevanceScore || 0) * 100)}%`
          ).join('\n\n')}${relevantCards.length > 3 ? `\n\n还有${relevantCards.length - 3}个相关资料...` : ''}`,
          sourceCards: relevantCards
        };
      }
    }

    // 检查是否是生成内容的请求
    if (query.includes('生成') || query.includes('写') || query.includes('内容')) {
      const relevantCards = findRelevantCards(input);
      return {
        content: `我可以基于以下参考资料为你生成内容：\n\n${relevantCards.slice(0, 2).map(card =>
          `• ${card.title} (相关度: ${Math.round((card.relevanceScore || 0) * 100)}%)`
        ).join('\n')}\n\n请点击"基于资料生成"按钮，或者告诉我具体需要什么样的内容。`,
        sourceCards: relevantCards
      };
    }

    // 默认回复
    const responses = [
      '我建议在这个章节中添加更多具体的数据和案例来支撑你的观点。',
      '这个表述很好，不过可以考虑使用更专业的术语来提升文档的权威性。',
      '建议在此处添加相关的法规依据和标准要求。',
      '内容结构清晰，建议补充一些图表来更直观地展示信息。',
      '这部分内容可以进一步细化，添加具体的实施步骤和时间安排。'
    ];
    return { content: responses[Math.floor(Math.random() * responses.length)] };
  };

  // 保存文档
  const saveDocument = () => {
    console.log('保存文档:', {
      documentId,
      documentTitle,
      sections,
      projectId,
      templateId
    });

    // 模拟保存过程
    const saveData = {
      id: documentId,
      title: documentTitle,
      content: sections,
      projectId: projectId,
      templateId: templateId,
      lastModified: new Date().toISOString(),
      wordCount: sections.reduce((total, section) => {
        const sectionWords = section.content.length + (section.children?.reduce((subTotal, child) => subTotal + child.content.length, 0) || 0);
        return total + sectionWords;
      }, 0)
    };

    // 这里应该调用API保存文档
    console.log('保存的文档数据:', saveData);

    // 显示保存成功提示
    const saveButton = document.querySelector('.btn-primary');
    if (saveButton) {
      const originalText = saveButton.innerHTML;
      saveButton.innerHTML = '<svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>已保存';
      setTimeout(() => {
        saveButton.innerHTML = originalText;
      }, 2000);
    }
  };

  // 滚动到聊天底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // 用户进入文档时自动生成内容
  useEffect(() => {
    const hasEmptyContent = sections.some(section =>
      !section.content.trim() ||
      (section.children && section.children.some(child => !child.content.trim()))
    );

    if (hasEmptyContent && !isGeneratingContent && mode !== 'edit') {
      // 延迟一下，让用户看到界面加载
      setTimeout(() => {
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'assistant',
          content: '检测到新文档，我来帮你生成初始内容。正在分析相关参考资料...',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, welcomeMessage]);

        // 为空的章节生成内容
        sections.forEach(section => {
          if (!section.content.trim()) {
            generateSectionContent(section.id);
          }
          if (section.children) {
            section.children.forEach(child => {
              if (!child.content.trim()) {
                generateSectionContent(child.id);
              }
            });
          }
        });
      }, 1000);
    }
  }, [documentId, mode, sections, isGeneratingContent]); // 只在文档ID或模式改变时触发

  // 键盘快捷键和点击外部处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 只在textarea聚焦时处理格式化快捷键
      const isTextareaFocused = document.activeElement?.tagName === 'TEXTAREA';

      // Ctrl+S 保存文档
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDocument();
      }
      // Ctrl+E 编辑标题
      if ((e.ctrlKey || e.metaKey) && e.key === 'e' && !isEditingTitle) {
        e.preventDefault();
        setEditingTitleValue(documentTitle);
        setIsEditingTitle(true);
      }

      // 编辑器格式化快捷键
      if (isTextareaFocused && currentSection) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
          e.preventDefault();
          applyFormat('bold');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
          e.preventDefault();
          applyFormat('italic');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
          e.preventDefault();
          applyFormat('underline');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          applyFormat('link');
        }
      }
    };

    const handleClickOutside = () => {
      // 关闭模式下拉框
      if (showModeDropdown) {
        setShowModeDropdown(false);
      }
      // 关闭章节菜单
      setSectionMenuId(null);
      // 保存正在编辑的章节标题
      if (editingSectionId) {
        saveEditingSection();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [documentTitle, isEditingTitle, activeSection]);

  const currentSection = getCurrentSection();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              if (projectId) {
                navigate(`/my-workspace/private/${projectId}`);
              } else {
                navigate('/my-workspace/private');
              }
            }}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="返回项目"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {isEditingTitle ? (
            <input
              type="text"
              value={editingTitleValue}
              onChange={(e) => setEditingTitleValue(e.target.value)}
              onBlur={() => {
                if (editingTitleValue.trim()) {
                  setDocumentTitle(editingTitleValue.trim());
                } else {
                  setEditingTitleValue(documentTitle);
                }
                setIsEditingTitle(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (editingTitleValue.trim()) {
                    setDocumentTitle(editingTitleValue.trim());
                  } else {
                    setEditingTitleValue(documentTitle);
                  }
                  setIsEditingTitle(false);
                } else if (e.key === 'Escape') {
                  setEditingTitleValue(documentTitle);
                  setIsEditingTitle(false);
                }
              }}
              className="text-lg font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none min-w-[300px] px-1"
              autoFocus
              placeholder="输入文档标题..."
            />
          ) : (
            <div className="flex items-center space-x-2">
              <h1
                className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors px-1 py-1 rounded hover:bg-blue-50"
                onClick={() => {
                  setEditingTitleValue(documentTitle);
                  setIsEditingTitle(true);
                }}
                title="点击编辑标题"
              >
                {documentTitle}
              </h1>
              <Edit3 className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={saveDocument}
            className="btn-primary flex items-center"
            title="保存文档 (Ctrl+S)"
          >
            <Save className="h-4 w-4 mr-2" />
            保存文档
          </button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: `${leftSidebarWidth}px 1fr 350px` }}>
        {/* 左侧文档目录 - 可调节宽度 */}
        <div
          className="bg-white border-r border-gray-200 flex flex-col relative"
        >
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">文档目录</h3>
              <button
                onClick={addNewSection}
                className="text-gray-400 hover:text-gray-600"
                title="添加新章节"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {/* 目录树 */}
            {sections.map((section) => (
              <div key={section.id} className="mb-1">
                <div
                  className={`flex items-center px-2 py-2 rounded-lg cursor-pointer group ${activeSection === section.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.children && section.children.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSectionExpanded(section.id);
                      }}
                      className="mr-1 p-0.5 rounded hover:bg-gray-200"
                    >
                      {expandedSections.includes(section.id) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </button>
                  )}
                  <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                  
                  {editingSectionId === section.id ? (
                    <input
                      type="text"
                      value={editingSectionTitle}
                      onChange={(e) => setEditingSectionTitle(e.target.value)}
                      onBlur={saveEditingSection}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter') {
                          saveEditingSection();
                        } else if (e.key === 'Escape') {
                          cancelEditingSection();
                        }
                      }}
                      className="text-xs font-medium bg-white border border-blue-500 rounded px-1 py-0.5 flex-1 min-w-0"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span 
                      className="text-xs font-medium truncate flex-1"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        startEditingSection(section.id, section.title);
                      }}
                    >
                      {section.title}
                    </span>
                  )}
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                    {section.level < 4 && (
                      <button 
                        className="p-1 rounded hover:bg-green-100 text-green-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          addSubSection(section.id);
                        }}
                        title="添加子章节"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    )}
                    <button 
                      className="p-1 rounded hover:bg-red-100 text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSection(section.id);
                      }}
                      title="删除章节"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* 子章节 */}
                {section.children && expandedSections.includes(section.id) && (
                  <div className="ml-3 mt-1">
                    {section.children.map((child) => (
                      <div key={child.id} className="mb-1">
                        <div
                          className={`flex items-center px-2 py-1.5 rounded-lg cursor-pointer group ${activeSection === child.id
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          onClick={() => setActiveSection(child.id)}
                        >
                          {child.children && child.children.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSectionExpanded(child.id);
                              }}
                              className="mr-1 p-0.5 rounded hover:bg-gray-200"
                            >
                              {expandedSections.includes(child.id) ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </button>
                          )}
                          <div className="w-3 mr-1"></div>
                          <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
                          
                          {editingSectionId === child.id ? (
                            <input
                              type="text"
                              value={editingSectionTitle}
                              onChange={(e) => setEditingSectionTitle(e.target.value)}
                              onBlur={saveEditingSection}
                              onKeyDown={(e) => {
                                e.stopPropagation();
                                if (e.key === 'Enter') {
                                  saveEditingSection();
                                } else if (e.key === 'Escape') {
                                  cancelEditingSection();
                                }
                              }}
                              className="text-xs bg-white border border-blue-500 rounded px-1 py-0.5 flex-1 min-w-0"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span 
                              className="text-xs truncate flex-1"
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                startEditingSection(child.id, child.title);
                              }}
                            >
                              {child.title}
                            </span>
                          )}
                          
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                            {child.level < 4 && (
                              <button 
                                className="p-0.5 rounded hover:bg-green-100 text-green-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addSubSection(child.id);
                                }}
                                title="添加子章节"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            )}
                            <button 
                              className="p-0.5 rounded hover:bg-red-100 text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSection(child.id);
                              }}
                              title="删除章节"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* 三级子章节 */}
                        {child.children && expandedSections.includes(child.id) && (
                          <div className="ml-6 mt-1">
                            {child.children.map((grandchild) => (
                              <div key={grandchild.id} className="mb-1">
                                <div
                                  className={`flex items-center px-2 py-1 rounded-lg cursor-pointer group ${activeSection === grandchild.id
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                  onClick={() => setActiveSection(grandchild.id)}
                                >
                                  {grandchild.children && grandchild.children.length > 0 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSectionExpanded(grandchild.id);
                                      }}
                                      className="mr-1 p-0.5 rounded hover:bg-gray-200"
                                    >
                                      {expandedSections.includes(grandchild.id) ? (
                                        <ChevronDown className="h-2.5 w-2.5" />
                                      ) : (
                                        <ChevronRight className="h-2.5 w-2.5" />
                                      )}
                                    </button>
                                  )}
                                  <div className="w-3 mr-1"></div>
                                  <FileText className="h-2.5 w-2.5 mr-1 flex-shrink-0" />
                                  
                                  {editingSectionId === grandchild.id ? (
                                    <input
                                      type="text"
                                      value={editingSectionTitle}
                                      onChange={(e) => setEditingSectionTitle(e.target.value)}
                                      onBlur={saveEditingSection}
                                      onKeyDown={(e) => {
                                        e.stopPropagation();
                                        if (e.key === 'Enter') {
                                          saveEditingSection();
                                        } else if (e.key === 'Escape') {
                                          cancelEditingSection();
                                        }
                                      }}
                                      className="text-xs bg-white border border-blue-500 rounded px-1 py-0.5 flex-1 min-w-0"
                                      autoFocus
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  ) : (
                                    <span 
                                      className="text-xs truncate flex-1"
                                      onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        startEditingSection(grandchild.id, grandchild.title);
                                      }}
                                    >
                                      {grandchild.title}
                                    </span>
                                  )}
                                  
                                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                                    {grandchild.level < 4 && (
                                      <button 
                                        className="p-0.5 rounded hover:bg-green-100 text-green-600"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          addSubSection(grandchild.id);
                                        }}
                                        title="添加子章节"
                                      >
                                        <Plus className="h-2.5 w-2.5" />
                                      </button>
                                    )}
                                    <button 
                                      className="p-0.5 rounded hover:bg-red-100 text-red-500"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSection(grandchild.id);
                                      }}
                                      title="删除章节"
                                    >
                                      <X className="h-2.5 w-2.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* 四级子章节 */}
                                {grandchild.children && expandedSections.includes(grandchild.id) && (
                                  <div className="ml-8 mt-1">
                                    {grandchild.children.map((greatGrandchild) => (
                                      <div
                                        key={greatGrandchild.id}
                                        className={`flex items-center px-2 py-1 rounded-lg cursor-pointer group ${activeSection === greatGrandchild.id
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-400 hover:bg-gray-50'
                                          }`}
                                        onClick={() => setActiveSection(greatGrandchild.id)}
                                      >
                                        <div className="w-3 mr-1"></div>
                                        <div className="w-3 mr-1"></div>
                                        <FileText className="h-2 w-2 mr-1 flex-shrink-0" />
                                        
                                        {editingSectionId === greatGrandchild.id ? (
                                          <input
                                            type="text"
                                            value={editingSectionTitle}
                                            onChange={(e) => setEditingSectionTitle(e.target.value)}
                                            onBlur={saveEditingSection}
                                            onKeyDown={(e) => {
                                              e.stopPropagation();
                                              if (e.key === 'Enter') {
                                                saveEditingSection();
                                              } else if (e.key === 'Escape') {
                                                cancelEditingSection();
                                              }
                                            }}
                                            className="text-xs bg-white border border-blue-500 rounded px-1 py-0.5 flex-1 min-w-0"
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        ) : (
                                          <span 
                                            className="text-xs truncate flex-1"
                                            onDoubleClick={(e) => {
                                              e.stopPropagation();
                                              startEditingSection(greatGrandchild.id, greatGrandchild.title);
                                            }}
                                          >
                                            {greatGrandchild.title}
                                          </span>
                                        )}
                                        
                                        <button 
                                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-100 text-red-500"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteSection(greatGrandchild.id);
                                          }}
                                          title="删除章节"
                                        >
                                          <X className="h-2 w-2" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 左侧目录宽度调节条 */}
          <div
            className="absolute top-0 right-0 w-1 h-full bg-transparent hover:bg-blue-300 cursor-col-resize group transition-colors"
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startWidth = leftSidebarWidth;

              const handleMouseMove = (e: MouseEvent) => {
                const deltaX = e.clientX - startX;
                const newWidth = Math.max(180, Math.min(400, startWidth + deltaX));
                setLeftSidebarWidth(newWidth);
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1 h-8 bg-gray-300 group-hover:bg-blue-400 rounded-l transition-colors"></div>
          </div>
        </div>

        {/* 中间编辑区域 - 占满剩余高度 */}
        <div className="flex flex-col min-h-0 min-w-0">
          {/* 章节信息栏 */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>当前章节:</span>
                <span className="font-medium text-gray-900">
                  {currentSection?.title || '请选择章节'}
                </span>
              </div>

              {currentSection && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSourceAnalysisModal(true)}
                    className="flex items-center px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    title="源强分析"
                  >
                    <Calculator className="h-3 w-3 mr-1" />
                    源强分析
                  </button>
                  <button
                    onClick={() => {
                      // 保存当前章节
                      console.log('保存章节:', currentSection);
                      // 这里可以添加具体的保存逻辑

                      // 显示保存成功提示
                      const button = document.querySelector('.save-section-btn') as HTMLButtonElement;
                      if (button) {
                        const originalText = button.innerHTML;
                        button.innerHTML = '<svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>已保存';
                        setTimeout(() => {
                          button.innerHTML = originalText;
                        }, 2000);
                      }
                    }}
                    className="save-section-btn flex items-center px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    title="保存当前章节"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    保存章节
                  </button>


                </div>
              )}
            </div>
          </div>

          {/* 编辑器工具栏 */}
          {currentSection && (
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-2">
              <div className="flex items-center space-x-1">
                {/* 字体格式 */}
                <div className="flex items-center space-x-1 mr-4">
                  <button
                    onClick={() => applyFormat('bold')}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editorToolbar.bold ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
                      }`}
                    title="加粗 (Ctrl+B)"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => applyFormat('italic')}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editorToolbar.italic ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
                      }`}
                    title="斜体 (Ctrl+I)"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => applyFormat('underline')}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editorToolbar.underline ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
                      }`}
                    title="下划线 (Ctrl+U)"
                  >
                    <Underline className="h-4 w-4" />
                  </button>
                </div>

                {/* 分隔线 */}
                <div className="w-px h-6 bg-gray-300 mr-4"></div>

                {/* 列表和引用 */}
                <div className="flex items-center space-x-1 mr-4">
                  <button
                    onClick={() => applyFormat('list')}
                    className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                    title="无序列表"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => applyFormat('orderedList')}
                    className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                    title="有序列表"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => applyFormat('quote')}
                    className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                    title="引用"
                  >
                    <Quote className="h-4 w-4" />
                  </button>
                </div>

                {/* 分隔线 */}
                <div className="w-px h-6 bg-gray-300 mr-4"></div>

                {/* 插入功能 */}
                <div className="flex items-center space-x-1 mr-4">
                  <button
                    onClick={() => applyFormat('link')}
                    className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                    title="插入链接"
                  >
                    <Link className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertContent('\n![图片描述](图片链接)\n')}
                    className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                    title="插入图片"
                  >
                    <Image className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => applyFormat('heading')}
                    className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                    title="标题"
                  >
                    <Type className="h-4 w-4" />
                  </button>
                  <button
                    onClick={insertTable}
                    className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                    title="插入表格"
                  >
                    <Table className="h-4 w-4" />
                  </button>
                  <button
                    onClick={insertFormula}
                    className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                    title="插入公式"
                  >
                    <Calculator className="h-4 w-4" />
                  </button>
                  <button
                    onClick={insertFlowchart}
                    className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                    title="插入流程图"
                  >
                    <GitBranch className="h-4 w-4" />
                  </button>
                </div>

                {/* 分隔线 */}
                <div className="w-px h-6 bg-gray-300 mr-4"></div>

                {/* 对齐方式 */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditorToolbar(prev => ({ ...prev, textAlign: 'left' }))}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editorToolbar.textAlign === 'left' ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
                      }`}
                    title="左对齐"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditorToolbar(prev => ({ ...prev, textAlign: 'center' }))}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editorToolbar.textAlign === 'center' ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
                      }`}
                    title="居中对齐"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditorToolbar(prev => ({ ...prev, textAlign: 'right' }))}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${editorToolbar.textAlign === 'right' ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
                      }`}
                    title="右对齐"
                  >
                    <AlignRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 编辑器内容 - 占用大部分空间 */}
          <div className="flex-1 p-6 overflow-y-auto">
            {currentSection ? (
              <div className="h-full flex flex-col">
                {/* 生成状态指示器 */}
                {isGeneratingContent && (
                  <div className="flex justify-end items-center mb-4">
                    <div className="flex items-center text-xs text-blue-600">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                      生成中...
                    </div>
                  </div>
                )}

                <div className="flex-1 relative">
                  {showDiffMode ? (
                    /* Diff 对比模式 */
                    <div className="h-full border border-gray-300 rounded-lg overflow-hidden">
                      {/* Diff 头部标题 */}
                      <div className="bg-gray-50 border-b border-gray-300 px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-700">内容对比</span>
                          <div className="flex items-center space-x-4 text-xs">
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                              <span className="text-red-700">已删除</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                              <span className="text-green-700">新增内容</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowDiffMode(false)}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Diff 内容展示 */}
                      <div className="h-full overflow-y-auto p-4 bg-white font-mono text-sm leading-relaxed">
                        <div className="space-y-1">
                          {/* 模拟diff内容 - 这里是示例，实际需要diff算法 */}
                          <div className="flex">
                            <div className="w-8 text-gray-400 text-xs text-right pr-2 select-none">1</div>
                            <div>根据项目基本信息，本项目为</div>
                          </div>
                          <div className="flex">
                            <div className="w-8 text-gray-400 text-xs text-right pr-2 select-none">2</div>
                            <div>
                              <span className="bg-red-100 text-red-800 px-1 rounded line-through">某建设项目</span>
                              <span className="bg-green-100 text-green-800 px-1 rounded">工业园区综合开发建设项目</span>
                              。
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-8 text-gray-400 text-xs text-right pr-2 select-none">3</div>
                            <div></div>
                          </div>
                          <div className="flex">
                            <div className="w-8 text-gray-400 text-xs text-right pr-2 select-none">4</div>
                            <div>
                              <span className="bg-green-100 text-green-800 px-1 rounded">项目建设的主要目的是满足区域发展需求，提升环境保护水平。</span>
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-8 text-gray-400 text-xs text-right pr-2 select-none">5</div>
                            <div>根据相关技术导则要求，本次环境影响评价将严格按照国家相关法规和标准进行。</div>
                          </div>
                          <div className="flex">
                            <div className="w-8 text-gray-400 text-xs text-right pr-2 select-none">6</div>
                            <div></div>
                          </div>
                          <div className="flex">
                            <div className="w-8 text-gray-400 text-xs text-right pr-2 select-none">7</div>
                            <div>
                              <span className="bg-green-100 text-green-800 px-1 rounded">参考资料显示：环境影响评价技术导则、项目基本信息表、环境质量现状监测数据等文件为本次评价提供了重要依据。</span>
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-8 text-gray-400 text-xs text-right pr-2 select-none">8</div>
                            <div>
                              根据
                              <span className="bg-red-100 text-red-800 px-1 rounded line-through">初步分析</span>
                              <span className="bg-green-100 text-green-800 px-1 rounded">详细的环境影响分析</span>
                              ，项目实施对周边环境的影响在可控范围内。
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 普通编辑模式 */
                    <textarea
                      value={currentSection.content}
                      onChange={(e) => updateSectionContent(e.target.value)}
                      onMouseUp={handleTextSelection}
                      onKeyUp={handleTextSelection}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');

                        try {
                          const jsonData = e.dataTransfer.getData('application/json');
                          if (jsonData) {
                            const data = JSON.parse(jsonData);
                            if (data.type === 'reference-card') {
                              const insertText = `\n\n[参考资料：${data.card.title}]\n${data.content}\n[来源：${data.card.source}]\n\n`;
                              const textarea = e.currentTarget;
                              const start = textarea.selectionStart;
                              const currentContent = textarea.value;
                              const newContent = currentContent.substring(0, start) + insertText + currentContent.substring(start);
                              updateSectionContent(newContent);

                              // 设置光标位置
                              setTimeout(() => {
                                textarea.focus();
                                textarea.setSelectionRange(start + insertText.length, start + insertText.length);
                              }, 0);
                            }
                          } else {
                            // 处理纯文本拖拽
                            const text = e.dataTransfer.getData('text/plain');
                            if (text) {
                              const textarea = e.currentTarget;
                              const start = textarea.selectionStart;
                              const currentContent = textarea.value;
                              const newContent = currentContent.substring(0, start) + text + currentContent.substring(start);
                              updateSectionContent(newContent);
                            }
                          }
                        } catch (error) {
                          console.error('拖拽处理错误:', error);
                        }
                      }}
                      className={`w-full h-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm leading-relaxed transition-colors ${editorToolbar.textAlign === 'center' ? 'text-center' :
                          editorToolbar.textAlign === 'right' ? 'text-right' : 'text-left'
                        }`}
                      placeholder="在此输入章节内容...

支持 Markdown 格式：
• **粗体文本**
• *斜体文本*
• [链接文本](URL)
• > 引用文本
• • 无序列表
• 1. 有序列表

快捷键：
• Ctrl+B 加粗
• Ctrl+I 斜体
• Ctrl+U 下划线
• Ctrl+K 插入链接
• Ctrl+S 保存文档"
                      style={{
                        fontWeight: editorToolbar.bold ? 'bold' : 'normal',
                        fontStyle: editorToolbar.italic ? 'italic' : 'normal',
                        textDecoration: editorToolbar.underline ? 'underline' : 'none'
                      }}
                    />
                  )}

                  {/* 字数统计 */}
                  {!showDiffMode && (
                    <div className="absolute bottom-2 right-2">
                      <div className="text-xs text-gray-400 bg-white px-2 py-1 rounded shadow">
                        {currentSection.content.length} 字符
                      </div>
                    </div>
                  )}

                  {/* 测试按钮 - 用于触发diff模式 */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => {
                        setOriginalContent(currentSection.content);
                        setGeneratedContent(currentSection.content + '\n\n新生成的内容...');
                        setShowDiffMode(true);
                      }}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      预览Diff
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>请从左侧目录选择要编辑的章节</p>
                  <p className="text-sm mt-2">选择章节后即可使用富文本编辑工具</p>
                </div>
              </div>
            )}
          </div>

          {/* 参考资料卡片行 - 一行展示 */}
          <div className="border-t border-gray-200 bg-gray-50 p-4 h-48">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <h4 className="text-sm font-medium text-gray-900">参考资料</h4>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {referenceCards.length} 个资料
                </span>
              </div>
            </div>

            {/* 卡片横向滚动区域 */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div className="flex space-x-3 h-32">
                {referenceCards.map((card) => {
                  const isSelected = selectedReferenceCards.some(c => c.id === card.id);
                  const isSingleSelected = selectedReferenceCard?.id === card.id;

                  return (
                    <div
                      key={card.id}
                      className={`flex-shrink-0 w-64 h-full bg-white rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : isSingleSelected
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => setSelectedReferenceCard(isSingleSelected ? null : card)}
                      draggable
                      onDragStart={(e) => {
                        const dragData = {
                          type: 'reference-card',
                          card: card,
                          content: card.content
                        };
                        e.dataTransfer.setData('application/json', JSON.stringify(dragData));
                        e.dataTransfer.setData('text/plain', card.content);
                      }}
                    >
                      <div className="p-3 h-full flex flex-col">
                        {/* 卡片头部 */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {/* 类型图标 */}
                            <div className="flex-shrink-0">
                              {card.type === 'text' && <FileText className="h-3 w-3 text-blue-500" />}
                              {card.type === 'table' && <Table className="h-3 w-3 text-green-500" />}
                              {card.type === 'chart' && <BarChart3 className="h-3 w-3 text-purple-500" />}
                              {card.type === 'formula' && <Calculator className="h-3 w-3 text-orange-500" />}
                            </div>

                            {/* 标题 */}
                            <h5 className="text-xs font-medium text-gray-900 truncate" title={card.title}>
                              {card.title}
                            </h5>
                          </div>

                          {/* 选择按钮 */}
                          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleCardSelection(card);
                              }}
                              className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>

                        {/* 卡片内容 */}
                        <div className="flex-1 min-h-0">
                          <p className="text-xs text-gray-600 mb-2" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {card.content.substring(0, 80)}...
                          </p>
                        </div>

                        {/* 标签显示 */}
                        <div className="mb-2">
                          <div className="flex flex-wrap gap-1">
                            {card.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {card.tags.length > 2 && (
                              <span className="text-xs text-gray-400">
                                +{card.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 卡片底部信息 */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="truncate">{card.source}</span>
                          <span className="text-xs text-gray-400">{card.category}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 空状态 */}
                {referenceCards.length === 0 && (
                  <div className="flex-shrink-0 w-64 h-full flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <BookOpen className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-xs">没有找到资料</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧边栏 - 只保留AI聊天框 */}
        <div className="bg-white border-l border-gray-200 flex flex-col">
          {/* AI助手区域 - 全屏版 */}
          <div className="flex-1 flex flex-col">
            {/* AI助手头部 - 增强版 */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm font-medium text-gray-900">AI助手</h3>
                </div>
              </div>
            </div>
            {/* 聊天消息区域 */}
            <div className="overflow-y-auto p-3 space-y-3" style={{ height: 'calc(100vh - 410px)' }}>
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 ${message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                      }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'assistant' && (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.sourceCards && message.sourceCards.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">参考资料:</p>
                            <div className="space-y-1">
                              {message.sourceCards.slice(0, 2).map((card) => (
                                <div
                                  key={card.id}
                                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded cursor-pointer hover:bg-blue-100"
                                  onClick={() => setSelectedReferenceCard(card)}
                                >
                                  {card.title}
                                </div>
                              ))}
                              {message.sourceCards.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  还有 {message.sourceCards.length - 2} 个相关资料...
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                          {message.timestamp.toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {message.type === 'user' && (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-100" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* AI 正在输入指示器 */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* 聊天输入区域 - 现代化大型输入框 */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              {/* 等待接受/停止的框 */}
              {isTyping && (
                <div className="mb-3 flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-yellow-800">AI正在思考...</span>
                  </div>
                  <button
                    onClick={() => setIsTyping(false)}
                    className="text-yellow-600 hover:text-yellow-800 px-2 py-1 rounded hover:bg-yellow-100"
                  >
                    停止
                  </button>
                </div>
              )}

              {/* AI生成结果操作栏 */}
              {showDiffMode && (
                <div className="mb-3 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-800">AI已生成新内容，请查看对比结果</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowDiffMode(false)}
                      className="text-gray-600 hover:text-gray-800 px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                      暂停
                    </button>
                    <button
                      onClick={() => {
                        // 接受AI生成的内容
                        updateSectionContent(generatedContent);
                        setShowDiffMode(false);
                      }}
                      className="text-white px-3 py-1.5 text-sm bg-green-600 rounded hover:bg-green-700 transition-colors"
                    >
                      接受
                    </button>
                  </div>
                </div>
              )}

              {/* 主输入容器 */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                {/* 顶部 - 选中状态显示区域 */}
                <div className="px-4 py-3 border-b border-gray-100 min-h-[48px] flex items-center">
                  {(selectedText || selectedReferenceCard || selectedReferenceCards.length > 0) ? (
                    <div className="flex flex-wrap gap-2 w-full">
                      {selectedText && (
                        <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-lg text-sm">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          <span>正文</span>
                          <button
                            onClick={() => setSelectedText('')}
                            className="text-yellow-600 hover:text-yellow-800 ml-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {selectedReferenceCard && (
                        <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span>卡片</span>
                          <button
                            onClick={() => {
                              setSelectedReferenceCard(null);
                              setSelectedReferenceContent('');
                            }}
                            className="text-blue-600 hover:text-blue-800 ml-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {selectedReferenceCards.length > 0 && (
                        <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-lg text-sm">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>多选卡片 ({selectedReferenceCards.length})</span>
                          <button
                            onClick={() => setSelectedReferenceCards([])}
                            className="text-green-600 hover:text-green-800 ml-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">选择文本或卡片后显示在这里</span>
                  )}
                </div>

                {/* 中间 - 文本输入区域 */}
                <div className="px-4 py-3 min-h-[120px] relative">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={
                      selectedText
                        ? `${aiMode === 'question' ? '针对选中文本提问...' :
                          aiMode === 'search' ? '在选中文本中搜索...' :
                            '编辑选中文本...'}`
                        : selectedReferenceCard
                          ? `${aiMode === 'question' ? '针对选中资料提问...' :
                            aiMode === 'search' ? '在选中资料中搜索...' :
                              '基于选中资料编辑...'}`
                          : selectedReferenceCards.length > 0
                            ? `${aiMode === 'question' ? '针对多个资料提问...' :
                              aiMode === 'search' ? '在多个资料中搜索...' :
                                '基于多个资料编辑...'}`
                            : `${aiMode === 'question' ? '输入您的问题或指令...' :
                              aiMode === 'search' ? '输入搜索关键词...' :
                                '输入编辑指令...'} 按 Cmd/Ctrl + Enter 发送`
                    }
                    className="w-full h-full min-h-[96px] bg-transparent text-gray-900 placeholder-gray-500 border-0 resize-none focus:outline-none focus:ring-0 text-sm leading-relaxed"
                    style={{
                      height: Math.max(96, Math.min(240, chatInput.split('\n').length * 24 + 48))
                    }}
                  />
                </div>

                {/* 底部 - 操作按钮区域 */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* 模式选择器 - 下拉框形式 */}
                    <div className="relative">
                      <button
                        onClick={() => setShowModeDropdown(!showModeDropdown)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <span className={`w-2 h-2 rounded-full ${aiMode === 'question' ? 'bg-blue-500' :
                            aiMode === 'search' ? 'bg-green-500' :
                              'bg-purple-500'
                          }`}></span>
                        <span>
                          {aiMode === 'question' ? '提问模式' :
                            aiMode === 'search' ? '搜索模式' :
                              '编辑模式'}
                        </span>
                        <ChevronDown className={`h-3 w-3 transition-transform ${showModeDropdown ? 'rotate-180' : ''
                          }`} />
                      </button>

                      {showModeDropdown && (
                        <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                          <button
                            onClick={() => {
                              setAiMode('question');
                              setShowModeDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs rounded-t-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 ${aiMode === 'question' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                              }`}
                          >
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>提问模式</span>
                          </button>
                          <button
                            onClick={() => {
                              setAiMode('search');
                              setShowModeDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors flex items-center space-x-2 ${aiMode === 'search' ? 'bg-green-50 text-green-700' : 'text-gray-700'
                              }`}
                          >
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>搜索模式</span>
                          </button>
                          <button
                            onClick={() => {
                              setAiMode('edit');
                              setShowModeDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs rounded-b-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 ${aiMode === 'edit' ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                              }`}
                          >
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>编辑模式</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      <span>Cmd + Enter 发送</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isTyping && (
                      <button
                        onClick={() => setIsTyping(false)}
                        className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
                      >
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span>暂停</span>
                      </button>
                    )}

                    <button
                      onClick={() => sendMessage()}
                      disabled={!chatInput.trim() || isTyping}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      <Send className="h-4 w-4" />

                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 公式编辑器模态框 */}
      {showFormulaEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-6xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <FormulaEditor
              content={editingContent}
              onChange={handleFormulaChange}
              onClose={handleFormulaClose}
              tags={editingTags}
              onTagsChange={setEditingTags}
              title={editingTitle}
              onTitleChange={setEditingTitle}
            />
          </div>
        </div>
      )}

      {/* 流程图编辑器模态框 */}
      {showFlowchartEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-6xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <FlowchartEditor
              content={editingContent}
              onChange={handleFlowchartChange}
              onClose={handleFlowchartClose}
              tags={editingTags}
              onTagsChange={setEditingTags}
              title={editingTitle}
              onTitleChange={setEditingTitle}
            />
          </div>
        </div>
      )}

      {/* 源强分析浮窗 */}
      {showSourceAnalysisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-5xl max-h-[85vh] bg-white rounded-lg shadow-xl overflow-hidden">
            {/* 浮窗头部 */}
            <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calculator className="h-6 w-6" />
                <h2 className="text-xl font-semibold">源强分析</h2>
              </div>
              <button
                onClick={() => setShowSourceAnalysisModal(false)}
                className="text-green-100 hover:text-white transition-colors p-1 rounded hover:bg-green-700"
                title="关闭"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 浮窗内容 */}
            <div className="p-6 h-[calc(85vh-80px)] overflow-y-auto">
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">源强分析功能</h3>
                  <p className="text-sm text-gray-400">此功能正在开发中，敬请期待...</p>
                </div>
              </div>
            </div>

            {/* 浮窗底部操作栏 */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowSourceAnalysisModal(false)}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled
              >
                开始分析
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentEditor;
