import { FileUp, FilePlus2, FileText, Upload } from 'lucide-react';
import { useState } from 'react';

interface UploadAreaProps {
  onFileUpload: (file: File) => void;
}

const UploadArea = ({ onFileUpload }: UploadAreaProps) => {
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const recentDocuments = [
    { id: 1, name: '法律简报 - 张三案例.docx', date: '2小时前' },
    { id: 2, name: '2024年Q1市场分析.pdf', date: '1天前' },
    { id: 3, name: '监管合规更新.pdf', date: '3天前' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      <div
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload
          className={`h-12 w-12 ${
            dragActive ? 'text-primary-500' : 'text-gray-400'
          }`}
        />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          拖放您的文档到这里
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          支持PDF、Word、Excel或PowerPoint文件，最大100MB
        </p>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        />
        <button
          onClick={() => document.getElementById('file-upload')?.click()}
          className="btn-primary mt-4"
        >
          <FileUp className="mr-2 h-4 w-4" />
          选择文件
        </button>
      </div>
      
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">最近文档</h3>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
            查看全部
          </button>
        </div>
        <ul className="mt-4 divide-y divide-gray-200">
          {recentDocuments.map((doc) => (
            <li key={doc.id} className="py-3">
              <button className="flex w-full items-center justify-between text-left">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span className="ml-3 text-sm text-gray-900">{doc.name}</span>
                </div>
                <span className="text-xs text-gray-500">{doc.date}</span>
              </button>
            </li>
          ))}
        </ul>
        <button className="btn-outline mt-4 w-full">
          <FilePlus2 className="mr-2 h-4 w-4" />
          创建新文档
        </button>
      </div>
    </div>
  );
};

export default UploadArea;