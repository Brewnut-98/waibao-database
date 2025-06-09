import { useState } from 'react';
import { ArrowLeft, FileUp, Search, Upload, Eye, Trash2, RotateCcw, CheckCircle, Folder, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProcessingDocument {
  id: string;
  title: string;
  size: string;
  uploadedAt: string;
  status: 'text_splitting' | 'processing' | 'validating' | 'complete' | 'error';
  progress: number;
  projectId: string;
  projectName: string;
}

const DataProcessing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProcessingDocument['status'] | 'all'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'multiple'>('single');
  const [isPreview, setIsPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // 模拟项目数据
  const projects = [
    { id: '1', name: '环保科技园区环评项目' },
    { id: '2', name: '工业污水处理厂建设项目' },
    { id: '3', name: '新能源发电站环境影响评价' },
    { id: '4', name: '化工园区规划环评' }
  ];

  const documents: ProcessingDocument[] = [
    {
      id: '1',
      title: '2024年法律合规指南.pdf',
      size: '2.5 MB',
      uploadedAt: '2024-04-10 14:30',
      status: 'processing',
      progress: 65,
      projectId: '1',
      projectName: '环保科技园区环评项目'
    },
    {
      id: '2',
      title: '市场分析报告.docx',
      size: '1.8 MB',
      uploadedAt: '2024-04-10 14:25',
      status: 'validating',
      progress: 100,
      projectId: '2',
      projectName: '工业污水处理厂建设项目'
    },
    {
      id: '3',
      title: '财务报表.xlsx',
      size: '3.2 MB',
      uploadedAt: '2024-04-10 14:20',
      status: 'complete',
      progress: 100,
      projectId: '1',
      projectName: '环保科技园区环评项目'
    },
    {
      id: '4',
      title: '产品规划.pptx',
      size: '5.1 MB',
      uploadedAt: '2024-04-10 14:15',
      status: 'error',
      progress: 60,
      projectId: '3',
      projectName: '新能源发电站环境影响评价'
    },
    {
      id: '5',
      title: '技术规范文档.pdf',
      size: '4.2 MB',
      uploadedAt: '2024-04-10 14:10',
      status: 'text_splitting',
      progress: 25,
      projectId: '2',
      projectName: '工业污水处理厂建设项目'
    }
  ];

  const handleFileSelect = (file: File) => {
    if (!selectedProjectId) {
      alert('请先选择要上传到的项目文件夹');
      return;
    }

    // 模拟生成新文档ID
    const newDocId = `doc_${Date.now()}`;
    
    setSelectedFile(file);
    setShowUploadModal(false);
    setSelectedProjectId('');
    
    // 跳转到新的三步骤处理流程的第一步（写死ID为1）
    navigate(`/process-step1/1`);
  };

  // 操作处理函数 - 根据状态跳转到对应的步骤页面
  const handleView = (docId: string) => {
    console.log('查看文档:', docId);
    // 写死跳转到固定的案例ID，因为这是高保真原型
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    switch (doc.status) {
      case 'text_splitting':
        navigate(`/process-step1/1`);
        break;
      case 'processing':
        navigate(`/process-step2/1`);
        break;
      case 'validating':
        navigate(`/process-step3/1`);
        break;
      case 'complete':
        navigate(`/process-step4/1`); // 完成状态跳转到step4（暂时还没实现）
        break;
      case 'error':
        navigate(`/process-step1/1`); // 错误状态重新从第一步开始
        break;
      default:
        navigate(`/process-step1/1`);
    }
  };

  const handleDelete = (docId: string) => {
    console.log('删除文档:', docId);
    alert(`删除文档: ${docId}`);
  };

  const handleRestart = (docId: string) => {
    console.log('重启处理:', docId);
    alert(`重启处理: ${docId}`);
  };

  const handleStore = (docId: string) => {
    console.log('文档入库:', docId);
    alert(`文档入库: ${docId}`);
  };

  // 根据状态渲染操作按钮（不包含删除按钮）
  const renderActionButtons = (doc: ProcessingDocument) => {
    const baseButtonClass = "inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors";
    
    switch (doc.status) {
      case 'text_splitting':
        return (
          <button
            onClick={() => handleView(doc.id)}
            className={`${baseButtonClass} text-purple-700 bg-purple-100 hover:bg-purple-200`}
            title="查看文本分割进度"
          >
            <Eye className="h-3 w-3 mr-1" />
            查看
          </button>
        );
      case 'processing':
        return (
          <button
            onClick={() => handleView(doc.id)}
            className={`${baseButtonClass} text-blue-700 bg-blue-100 hover:bg-blue-200`}
            title="查看AI处理进度"
          >
            <Eye className="h-3 w-3 mr-1" />
            查看
          </button>
        );
      case 'validating':
        return (
          <button
            onClick={() => handleView(doc.id)}
            className={`${baseButtonClass} text-yellow-700 bg-yellow-100 hover:bg-yellow-200`}
            title="查看验证进度"
          >
            <Eye className="h-3 w-3 mr-1" />
            查看
          </button>
        );
      case 'complete':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleView(doc.id)}
              className={`${baseButtonClass} text-blue-700 bg-blue-100 hover:bg-blue-200`}
              title="查看详情"
            >
              <Eye className="h-3 w-3 mr-1" />
              查看
            </button>
          </div>
        );
      case 'error':
        return (
          <button
            onClick={() => handleRestart(doc.id)}
            className={`${baseButtonClass} text-orange-700 bg-orange-100 hover:bg-orange-200`}
            title="重新处理"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            重启
          </button>
        );
      default:
        return null;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isPreview && selectedFile) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsPreview(false);
              setSelectedFile(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">返回</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Original Document Preview */}
          <div className="card h-[calc(100vh-12rem)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900">原始文档</h3>
              <span className="text-sm text-gray-500">{selectedFile.name}</span>
            </div>
            <div className="mt-4 h-full overflow-y-auto">
              <div className="flex h-full items-center justify-center text-gray-500">
                <p>文档预览区域</p>
              </div>
            </div>
          </div>

          {/* Processing Status */}
          <div className="card h-[calc(100vh-12rem)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900">处理状态</h3>
              <div className="flex items-center">
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                <span className="ml-2 text-sm text-gray-500">正在处理</span>
              </div>
            </div>
            <div className="mt-4 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700">当前进度</h4>
                <div className="mt-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-2 w-1/3 animate-pulse rounded-full bg-blue-500"></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">正在分析文档结构...</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">处理步骤</h4>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-sm text-gray-500">文档上传完成</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                    <span className="ml-2 text-sm text-gray-500">正在分析文档结构</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    <span className="ml-2 text-sm text-gray-500">提取文档内容</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    <span className="ml-2 text-sm text-gray-500">生成段落索引</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">文档信息</h4>
                <div className="mt-2 rounded-lg bg-gray-50 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">文件大小</p>
                      <p className="text-sm font-medium text-gray-900">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">文件类型</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedFile.type || '未知'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">上传时间</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">预计完成时间</p>
                      <p className="text-sm font-medium text-gray-900">2-3分钟</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">文档处理</h1>
          <p className="text-sm text-gray-500">管理正在处理的文档</p>
        </div>
        
        <button 
          className="btn-primary"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload className="mr-2 h-4 w-4" />
          上传文档
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex rounded-lg border border-gray-200 bg-white">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 text-sm font-medium ${
              statusFilter === 'all'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            } rounded-l-lg border-r border-gray-200`}
          >
            全部
          </button>
          <button
            onClick={() => setStatusFilter('text_splitting')}
            className={`px-4 py-2 text-sm font-medium ${
              statusFilter === 'text_splitting'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            } border-r border-gray-200`}
          >
            文本分割
          </button>
          <button
            onClick={() => setStatusFilter('processing')}
            className={`px-4 py-2 text-sm font-medium ${
              statusFilter === 'processing'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            } border-r border-gray-200`}
          >
            处理中
          </button>
          <button
            onClick={() => setStatusFilter('validating')}
            className={`px-4 py-2 text-sm font-medium ${
              statusFilter === 'validating'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            } border-r border-gray-200`}
          >
            待验证
          </button>
          <button
            onClick={() => setStatusFilter('complete')}
            className={`px-4 py-2 text-sm font-medium ${
              statusFilter === 'complete'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            } rounded-r-lg`}
          >
            已完成
          </button>
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

      {/* Document List */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                文档名称
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                项目文件夹
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                大小
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                上传时间
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                状态
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                进度
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                操作
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                删除
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredDocuments.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">{doc.projectName}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {doc.size}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {doc.uploadedAt}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    doc.status === 'text_splitting' ? 'bg-purple-100 text-purple-800' :
                    doc.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    doc.status === 'validating' ? 'bg-yellow-100 text-yellow-800' :
                    doc.status === 'complete' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {doc.status === 'text_splitting' ? '文本分割' :
                     doc.status === 'processing' ? '处理中' :
                     doc.status === 'validating' ? '待验证' :
                     doc.status === 'complete' ? '已完成' :
                     '处理失败'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div 
                        className={`h-2 rounded-full ${
                          doc.status === 'error' ? 'bg-red-500' :
                          doc.status === 'complete' ? 'bg-green-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${doc.progress}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-500">{doc.progress}%</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {renderActionButtons(doc)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors text-red-700 bg-red-100 hover:bg-red-200"
                    title="删除文档"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6">
            <h3 className="text-lg font-medium text-gray-900">上传新文档</h3>
            <p className="mt-2 text-sm text-gray-500">
              选择上传模式并添加要处理的文档。
            </p>

            {/* 项目选择 */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择项目文件夹 *
              </label>
              <div className="relative">
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="">请选择项目文件夹</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Folder className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <button
                onClick={() => setUploadMode('single')}
                className={`flex flex-col items-center rounded-lg border p-4 ${
                  uploadMode === 'single'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <FileUp className={`h-8 w-8 ${
                  uploadMode === 'single' ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <span className="mt-2 font-medium">单文件上传</span>
                <span className="mt-1 text-xs text-gray-500">
                  上传单个文档进行处理
                </span>
              </button>

              <button
                disabled
                className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-4 opacity-50"
              >
                <FileUp className="h-8 w-8 text-gray-400" />
                <span className="mt-2 font-medium">批量上传</span>
                <span className="mt-1 text-xs text-gray-500">
                  即将推出
                </span>
              </button>
            </div>

            <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
              <div className="text-center">
                <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-900">
                  将文件拖放到此处或点击上传
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  支持 PDF、Word、Excel 或 PowerPoint 文件
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />
                <button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="btn-primary mt-4"
                >
                  选择文件
                </button>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedProjectId('');
                }}
                className="btn-outline"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataProcessing;