import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, CheckCircle, AlertCircle, Activity, Image, Table, Type, Tag } from 'lucide-react';

interface ProcessStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  startTime?: string;
  endTime?: string;
  duration?: string;
  details?: string;
}

interface ContentCard {
  id: string;
  type: 'text' | 'table' | 'image';
  title: string; // AI总结内容
  content: string;
  page?: number;
  section?: string; // 所属段落，如"第一章第二节"
  tags?: string[];
}

interface ProcessingDetailData {
  id: string;
  title: string;
  size: string;
  uploadedAt: string;
  status: 'processing' | 'validating' | 'complete' | 'error';
  progress: number;
  steps: ProcessStep[];
  extractedContent: ContentCard[];
}

const ProcessingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'progress' | 'steps' | 'logs'>('progress');
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);

  // 判断是否是新上传的文档
  const isNewUpload = id?.startsWith('doc_');
  
  // 模拟数据 - 实际项目中从API获取
  const [processingData, setProcessingData] = useState<ProcessingDetailData>({
    id: id || '1',
    title: isNewUpload ? '新上传文档.pdf' : '2024年法律合规指南.pdf',
    size: isNewUpload ? '1.8 MB' : '2.5 MB',
    uploadedAt: isNewUpload ? new Date().toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).replace(/\//g, '-') : '2024-04-10 14:30',
    status: 'processing',
    progress: isNewUpload ? 5 : 45,
    steps: isNewUpload ? [
      {
        id: '1',
        name: '文档上传',
        status: 'completed',
        startTime: new Date().toLocaleTimeString(),
        endTime: new Date().toLocaleTimeString(),
        duration: '2秒',
        details: '文档已成功上传到服务器'
      },
      {
        id: '2',
        name: '格式识别',
        status: 'processing',
        startTime: new Date().toLocaleTimeString(),
        details: '正在识别文档格式和页数...'
      },
      {
        id: '3',
        name: '内容提取',
        status: 'pending',
        details: '待处理 - 提取文档内容和结构信息'
      },
      {
        id: '4',
        name: '智能分析',
        status: 'pending',
        details: '待处理 - 分析文档主题和关键信息'
      },
      {
        id: '5',
        name: '索引生成',
        status: 'pending',
        details: '待处理 - 生成搜索索引和标签'
      },
      {
        id: '6',
        name: '质量检查',
        status: 'pending',
        details: '待处理 - 验证处理结果质量'
      }
    ] : [
      {
        id: '1',
        name: '文档上传',
        status: 'completed',
        startTime: '14:30:00',
        endTime: '14:30:15',
        duration: '15秒',
        details: '文档已成功上传到服务器'
      },
      {
        id: '2',
        name: '格式识别',
        status: 'completed',
        startTime: '14:30:15',
        endTime: '14:30:45',
        duration: '30秒',
        details: '识别为PDF格式，共125页'
      },
      {
        id: '3',
        name: '内容提取',
        status: 'processing',
        startTime: '14:30:45',
        details: '正在提取文档内容和结构信息...'
      },
      {
        id: '4',
        name: '智能分析',
        status: 'pending',
        details: '待处理 - 分析文档主题和关键信息'
      },
      {
        id: '5',
        name: '索引生成',
        status: 'pending',
        details: '待处理 - 生成搜索索引和标签'
      },
      {
        id: '6',
        name: '质量检查',
        status: 'pending',
                 details: '待处理 - 验证处理结果质量'
       }
     ],
     extractedContent: isNewUpload ? [] : [
       {
         id: 'content_1',
         type: 'text',
         title: '介绍企业法律合规框架的重要性和构建原则',
         content: '本指南旨在为企业提供全面的法律合规框架，确保业务运营符合相关法律法规要求。在当今复杂的监管环境中，企业需要建立完善的合规体系来识别、评估和管理法律风险...',
         page: 1,
         section: '第一章',
         tags: ['法律合规', '风险管理', '企业制度']
       },
       {
         id: 'content_2',
         type: 'table',
         title: '各部门合规检查任务分工及时间安排表',
         content: '序号 | 检查项目 | 负责部门 | 完成时间\n1 | 数据保护合规 | IT部门 | 2024-03-01\n2 | 财务报告合规 | 财务部门 | 2024-03-15\n3 | 劳动法合规 | 人事部门 | 2024-03-30',
         page: 3,
         section: '第一章第二节',
         tags: ['检查清单', '部门职责', '时间规划']
       },
       {
         id: 'content_3',
         type: 'image',
         title: '展示合规管理组织架构和部门职责分工',
         content: '组织架构图显示了合规管理的层级结构和各部门职责分工',
         page: 5,
         section: '第一章第三节',
         tags: ['流程图', '组织架构', '职责分工']
       },
       {
         id: 'content_4',
         type: 'text',
         title: '阐述风险管理机制和主要风险类别识别',
         content: '风险管理是合规体系的核心组成部分。企业应当建立系统性的风险识别机制，定期评估内外部环境变化对业务合规性的影响。主要风险类别包括：监管风险、操作风险、声誉风险等...',
         page: 8,
         section: '第二章 风险管理',
         tags: ['风险管理', '识别机制', '影响评估']
       },
       {
         id: 'content_5',
         type: 'table',
         title: '不同风险类型的发生概率和影响程度评估',
         content: '风险类型 | 发生概率 | 影响程度 | 风险等级\n监管风险 | 高 | 严重 | 极高\n操作风险 | 中 | 中等 | 中等\n声誉风险 | 低 | 严重 | 中高',
         page: 10,
         section: '第二章第一节',
         tags: ['风险评估', '概率分析', '等级分类']
       },
       {
         id: 'content_6',
         type: 'text',
         title: '总结各监管机构要求和法规更新应对策略',
         content: '企业需要严格遵守相关监管机构的要求，包括但不限于证监会、银保监会、央行等部门的规定。定期关注法规更新，及时调整内部制度...',
         page: 15,
         section: '第三章 监管要求',
         tags: ['监管要求', '法规更新', '制度调整']
       }
     ]
   });

  // 模拟实时更新
  useEffect(() => {
    if (processingData.status === 'processing') {
      const interval = setInterval(() => {
        setProcessingData(prev => {
          const newProgress = Math.min(prev.progress + Math.random() * 5, 100);
          return {
            ...prev,
            progress: newProgress
          };
        });
      }, 2000);
      setRefreshInterval(interval);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [processingData.status]);

  // 模拟卡片生成状态
  useEffect(() => {
    if (isNewUpload) {
      setIsGeneratingCards(true);
      const timer = setTimeout(() => {
        setIsGeneratingCards(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isNewUpload]);

  const getStatusIcon = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Activity className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'processing':
        return '处理中';
      case 'error':
        return '处理失败';
      default:
        return '等待中';
    }
  };

  // 渲染内容卡片
  const renderContentCard = (card: ContentCard) => {
    const getTypeIcon = () => {
      switch (card.type) {
        case 'text':
          return <Type className="h-4 w-4 text-blue-500" />;
        case 'table':
          return <Table className="h-4 w-4 text-green-500" />;
        case 'image':
          return <Image className="h-4 w-4 text-purple-500" />;
      }
    };

    const renderContent = () => {
      switch (card.type) {
        case 'text':
          return (
            <p className="text-sm text-gray-600 line-clamp-3">
              {card.content}
            </p>
          );
        case 'table':
          const rows = card.content.split('\n');
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <tbody className="divide-y divide-gray-200">
                  {rows.map((row, index) => (
                    <tr key={index} className={index === 0 ? 'bg-gray-50 font-medium' : ''}>
                      {row.split(' | ').map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-2 py-1 text-gray-600">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        case 'image':
          return (
            <div className="flex items-center justify-center h-20 bg-gray-100 rounded border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Image className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">{card.content}</p>
              </div>
            </div>
          );
      }
    };

    return (
      <div key={card.id} className="card p-4 hover:shadow-md transition-shadow">
        {/* 所属段落 */}
        {card.section && (
          <div className="mb-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {card.section}
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-2">
          {getTypeIcon()}
          <h4 className="font-medium text-gray-900 text-sm">{card.title}</h4>
          <span className="text-xs text-gray-500 ml-auto">
            第{card.page}页
          </span>
        </div>
        {renderContent()}
        
        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {card.tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

          return (
      <div className="animate-fade-in h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <button
            onClick={() => navigate('/my-workspace/process')}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">返回</span>
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">
            {processingData.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{processingData.size}</span>
            <span>{processingData.uploadedAt}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Document Preview */}
          <div className="w-1/2 border-r border-gray-200 bg-white flex items-center justify-center">
            <div className="text-center">
              <span className="text-gray-500">上传文档的预览区域</span>
            </div>
          </div>

        {/* Right: Content Cards + Info Panel */}
        <div className="w-1/2 flex flex-col">
          {/* Top: Content Cards */}
          <div className="h-2/3 border-b border-gray-200">
            <div className="h-full flex flex-col">
              <div className="p-3 border-b border-gray-200 bg-white">
                <h3 className="font-medium text-gray-900 text-sm">
                  拆分内容 
                  <span className="text-xs text-gray-500 ml-2">
                    ({processingData.extractedContent.length} 个片段)
                  </span>
                  {isGeneratingCards && (
                    <span className="inline-flex items-center gap-1 ml-2 text-xs text-blue-600">
                      <Activity className="h-3 w-3 animate-spin" />
                      生成中
                    </span>
                  )}
                </h3>
              </div>
              <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
                {processingData.extractedContent.length > 0 ? (
                  <div className="space-y-2">
                    {processingData.extractedContent.map(renderContentCard)}
                  </div>
                ) : isGeneratingCards ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400 animate-spin" />
                      <p className="text-sm">正在生成内容卡片...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400 animate-spin" />
                      <p className="text-sm">正在拆分文档内容...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom: Info Panel with Tabs */}
          <div className="h-1/3">
            <div className="h-full flex flex-col">
                            {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 bg-white">
                {[
                  { key: 'progress', label: '进度', icon: Activity },
                  { key: 'info', label: '信息', icon: FileText },
                  { key: 'steps', label: '步骤', icon: CheckCircle },
                  { key: 'logs', label: '日志', icon: Clock }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as any)}
                    className={`flex items-center gap-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                      activeTab === key
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-3 overflow-y-auto bg-white text-xs">
                 {activeTab === 'progress' && (
                   <div className="space-y-3">
                     <div>
                       <div className="flex items-center justify-between mb-1">
                         <p className="text-xs font-medium text-gray-700">总体进度</p>
                         <p className="text-xs text-gray-900">{Math.round(processingData.progress)}%</p>
                       </div>
                       <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                         <div 
                           className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                           style={{ width: `${processingData.progress}%` }}
                         ></div>
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2 text-center">
                       <div className="rounded bg-blue-50 p-2">
                         <p className="text-sm font-semibold text-blue-600">{isNewUpload ? '1' : '3'}</p>
                         <p className="text-xs text-blue-600">已完成</p>
                       </div>
                       <div className="rounded bg-gray-50 p-2">
                         <p className="text-sm font-semibold text-gray-600">6</p>
                         <p className="text-xs text-gray-600">总步骤</p>
                       </div>
                     </div>

                     <div>
                       <p className="text-xs font-medium text-gray-700">预计完成时间</p>
                       <p className="mt-1 text-xs text-gray-900">约2-3分钟</p>
                     </div>
                   </div>
                 )}

                 {activeTab === 'info' && (
                   <div className="space-y-4">
                     <div>
                       <p className="text-sm font-medium text-gray-700">文档名称</p>
                       <p className="mt-1 text-sm text-gray-900">{processingData.title}</p>
                     </div>
                     
                     <div>
                       <p className="text-sm font-medium text-gray-700">文件大小</p>
                       <p className="mt-1 text-sm text-gray-900">{processingData.size}</p>
                     </div>
                     
                     <div>
                       <p className="text-sm font-medium text-gray-700">上传时间</p>
                       <p className="mt-1 text-sm text-gray-900">{processingData.uploadedAt}</p>
                     </div>
                     
                     <div>
                       <p className="text-sm font-medium text-gray-700">当前状态</p>
                       <div className="mt-1 flex items-center gap-2">
                         <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                           processingData.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                           processingData.status === 'validating' ? 'bg-yellow-100 text-yellow-800' :
                           processingData.status === 'complete' ? 'bg-green-100 text-green-800' :
                           'bg-red-100 text-red-800'
                         }`}>
                           {processingData.status === 'processing' ? '处理中' :
                            processingData.status === 'validating' ? '待验证' :
                            processingData.status === 'complete' ? '已完成' :
                            '处理失败'}
                         </span>
                       </div>
                     </div>
                   </div>
                 )}

                 {activeTab === 'steps' && (
                   <div className="space-y-4">
                     {processingData.steps.map((step, index) => (
                       <div key={step.id} className="flex items-start gap-3">
                         <div className="flex flex-col items-center">
                           {getStatusIcon(step.status)}
                           {index < processingData.steps.length - 1 && (
                             <div className="mt-2 h-6 w-px bg-gray-200"></div>
                           )}
                         </div>
                         
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between">
                             <h4 className="text-sm font-medium text-gray-900">{step.name}</h4>
                             <span className="text-xs text-gray-500">{getStatusText(step.status)}</span>
                           </div>
                           
                           <p className="mt-1 text-xs text-gray-600">{step.details}</p>
                           
                           {step.startTime && (
                             <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                               <span>开始: {step.startTime}</span>
                               {step.endTime && <span>结束: {step.endTime}</span>}
                               {step.duration && <span>耗时: {step.duration}</span>}
                             </div>
                           )}
                         </div>
                       </div>
                     ))}
                   </div>
                 )}

                 {activeTab === 'logs' && (
                   <div className="space-y-2">
                     {isNewUpload ? (
                       <>
                         <div className="text-xs text-gray-500 font-mono">
                           [{new Date().toLocaleTimeString()}] 文档上传成功
                         </div>
                         <div className="text-xs text-gray-500 font-mono">
                           [{new Date().toLocaleTimeString()}] 文件大小: 1.8MB
                         </div>
                         <div className="text-xs text-blue-600 font-mono animate-pulse">
                           [{new Date().toLocaleTimeString()}] 正在识别文档格式...
                         </div>
                       </>
                     ) : (
                       <>
                         <div className="text-xs text-gray-500 font-mono">
                           [14:30:45] 开始内容提取...
                         </div>
                         <div className="text-xs text-gray-500 font-mono">
                           [14:30:48] 检测到125页内容
                         </div>
                         <div className="text-xs text-gray-500 font-mono">
                           [14:30:52] 正在提取第1-25页...
                         </div>
                         <div className="text-xs text-blue-600 font-mono animate-pulse">
                           [14:31:10] 正在提取第26-50页...
                         </div>
                       </>
                     )}
                   </div>
                 )}
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
};

export default ProcessingDetail; 