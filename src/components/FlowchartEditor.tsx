import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Minus, Move, Square, Circle, Diamond, ArrowRight, Tag, Image, Trash2, Edit3 } from 'lucide-react';

interface FlowchartNode {
  id: string;
  type: 'rectangle' | 'circle' | 'diamond';
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FlowchartConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
}

interface FlowchartEditorProps {
  content: string;
  onChange: (content: string) => void;
  onClose: () => void;
  tags?: string[];
  onTagsChange?: (tags: string[]) => void;
  originalImage?: string;
  title?: string;
  onTitleChange?: (title: string) => void;
}

const FlowchartEditor: React.FC<FlowchartEditorProps> = ({
  content,
  onChange,
  onClose,
  tags = [],
  onTagsChange,
  originalImage,
  title = '',
  onTitleChange
}) => {
  const [nodes, setNodes] = useState<FlowchartNode[]>([]);
  const [connections, setConnections] = useState<FlowchartConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingTags, setEditingTags] = useState<string[]>([...tags]);
  const [newTag, setNewTag] = useState('');
  const [editingTitle, setEditingTitle] = useState(title);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 解析内容为节点和连接
  useEffect(() => {
    if (content) {
      // 简单解析流程图文本
      const parts = content.split(' → ');
      const initialNodes: FlowchartNode[] = parts.map((part, index) => ({
        id: `node_${index}`,
        type: 'rectangle' as const,
        text: part.trim(),
        x: 100 + index * 200,
        y: 150,
        width: 120,
        height: 60
      }));

      const initialConnections: FlowchartConnection[] = [];
      for (let i = 0; i < initialNodes.length - 1; i++) {
        initialConnections.push({
          id: `conn_${i}`,
          fromNodeId: initialNodes[i].id,
          toNodeId: initialNodes[i + 1].id
        });
      }

      setNodes(initialNodes);
      setConnections(initialConnections);
    }
  }, [content]);

  // 添加新节点
  const addNode = (type: 'rectangle' | 'circle' | 'diamond') => {
    const newNode: FlowchartNode = {
      id: `node_${Date.now()}`,
      type,
      text: '新节点',
      x: 100 + nodes.length * 150,
      y: 150,
      width: type === 'circle' ? 80 : 120,
      height: type === 'circle' ? 80 : 60
    };
    setNodes([...nodes, newNode]);
  };

  // 删除节点
  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.fromNodeId !== nodeId && c.toNodeId !== nodeId));
    setSelectedNode(null);
    setEditingNode(null);
  };

  // 更新节点文本
  const updateNodeText = (nodeId: string, text: string) => {
    setNodes(nodes.map(n => n.id === nodeId ? { ...n, text } : n));
  };

  // 处理鼠标按下
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setDraggedNode(nodeId);
    setSelectedNode(nodeId);
    
    const node = nodes.find(n => n.id === nodeId);
    if (node && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y
      });
    }
  };

  // 处理鼠标移动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      
      setNodes(nodes.map(n => 
        n.id === draggedNode 
          ? { ...n, x: Math.max(0, newX), y: Math.max(0, newY) }
          : n
      ));
    }
  };

  // 处理鼠标释放
  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  // 标签管理函数
  const addTag = () => {
    if (newTag.trim() && !editingTags.includes(newTag.trim())) {
      const updatedTags = [...editingTags, newTag.trim()];
      setEditingTags(updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    const updatedTags = editingTags.filter((_, i) => i !== index);
    setEditingTags(updatedTags);
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // 保存流程图、标签和标题
  const saveFlowchart = () => {
    const flowchartText = nodes.map(n => n.text).join(' → ');
    onChange(flowchartText);
    if (onTagsChange) {
      onTagsChange(editingTags);
    }
    if (onTitleChange) {
      onTitleChange(editingTitle);
    }
    onClose();
  };

  // 渲染节点
  const renderNode = (node: FlowchartNode) => {
    const isSelected = selectedNode === node.id;
    const isEditing = editingNode === node.id;

    const nodeStyle = {
      left: node.x,
      top: node.y,
      width: node.width,
      height: node.height
    };

    const getNodeShape = () => {
      const baseClasses = `absolute border-2 flex items-center justify-center cursor-move text-xs font-medium ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-400 bg-white hover:border-gray-600'
      }`;

      switch (node.type) {
        case 'circle':
          return `${baseClasses} rounded-full`;
        case 'diamond':
          return `${baseClasses} transform rotate-45`;
        case 'rectangle':
        default:
          return `${baseClasses} rounded`;
      }
    };

    return (
      <div
        key={node.id}
        style={nodeStyle}
        className={getNodeShape()}
        onMouseDown={(e) => handleMouseDown(e, node.id)}
        onDoubleClick={() => setEditingNode(node.id)}
      >
        {isEditing ? (
          <input
            type="text"
            value={node.text}
            onChange={(e) => updateNodeText(node.id, e.target.value)}
            onBlur={() => setEditingNode(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setEditingNode(null);
              }
            }}
            className={`w-full h-full text-center bg-transparent border-none outline-none text-xs ${
              node.type === 'diamond' ? 'transform -rotate-45' : ''
            }`}
            autoFocus
          />
        ) : (
          <span className={node.type === 'diamond' ? 'transform -rotate-45' : ''}>
            {node.text}
          </span>
        )}
      </div>
    );
  };

  // 渲染连接线
  const renderConnections = () => {
    return connections.map(conn => {
      const fromNode = nodes.find(n => n.id === conn.fromNodeId);
      const toNode = nodes.find(n => n.id === conn.toNodeId);
      
      if (!fromNode || !toNode) return null;

      const fromX = fromNode.x + fromNode.width;
      const fromY = fromNode.y + fromNode.height / 2;
      const toX = toNode.x;
      const toY = toNode.y + toNode.height / 2;

      return (
        <svg
          key={conn.id}
          className="absolute pointer-events-none"
          style={{
            left: Math.min(fromX, toX),
            top: Math.min(fromY, toY),
            width: Math.abs(toX - fromX),
            height: Math.abs(toY - fromY) || 2
          }}
        >
          <defs>
            <marker
              id={`arrowhead-${conn.id}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#666"
              />
            </marker>
          </defs>
          <line
            x1={fromX > toX ? Math.abs(toX - fromX) : 0}
            y1={fromY > toY ? Math.abs(toY - fromY) : 0}
            x2={fromX > toX ? 0 : Math.abs(toX - fromX)}
            y2={fromY > toY ? 0 : Math.abs(toY - fromY)}
            stroke="#666"
            strokeWidth="2"
            markerEnd={`url(#arrowhead-${conn.id})`}
          />
        </svg>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 flex-1">
            <Square className="h-5 w-5 text-purple-500" />
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-gray-900">流程图编辑器</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">标题:</span>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  placeholder="输入流程图标题..."
                  className="text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-w-[200px]"
                />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* 左侧面板 */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            {/* 上半部分：原始图片 */}
            <div className="h-1/3 border-b border-gray-200 overflow-hidden">
              <div className="p-3 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Image className="h-4 w-4 text-indigo-500" />
                  原始图片
                </h3>
              </div>
              <div className="p-3 h-full overflow-auto">
                {originalImage ? (
                  <img 
                    src={originalImage} 
                    alt="原始流程图" 
                    className="w-full h-auto rounded border border-gray-200"
                  />
                ) : (
                  <div className="flex items-center justify-center h-20 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Image className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">暂无原始图片</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 中间部分：工具栏 */}
            <div className="h-1/3 border-b border-gray-200 overflow-hidden">
              <div className="p-3 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Plus className="h-4 w-4 text-green-500" />
                  添加节点
                </h3>
              </div>
              <div className="p-3 space-y-2">
                <button
                  onClick={() => addNode('rectangle')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                >
                  <Square className="h-4 w-4" />
                  矩形节点
                </button>
                <button
                  onClick={() => addNode('circle')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100"
                >
                  <Circle className="h-4 w-4" />
                  圆形节点
                </button>
                <button
                  onClick={() => addNode('diamond')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100"
                >
                  <Diamond className="h-4 w-4" />
                  菱形节点
                </button>
                
                {selectedNode && (
                  <button
                    onClick={() => deleteNode(selectedNode)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    删除选中节点
                  </button>
                )}
              </div>
            </div>
            
            {/* 下半部分：标签管理 */}
            <div className="h-1/3 overflow-hidden">
              <div className="p-3 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-purple-500" />
                  标签管理
                </h3>
              </div>
              <div className="p-3 h-full overflow-auto">
                <div className="mb-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleTagKeyPress}
                      placeholder="输入新标签..."
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                      onClick={addTag}
                      className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      添加
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {editingTags.map((tag, index) => (
                    <div key={index} className="flex items-center justify-between bg-purple-50 px-2 py-1 rounded">
                      <span className="text-xs text-purple-800">{tag}</span>
                      <button
                        onClick={() => removeTag(index)}
                        className="text-purple-600 hover:text-red-600 ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {editingTags.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-4">暂无标签</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：流程图画布 */}
          <div className="flex-1 flex flex-col">
            {/* 工具栏 */}
            <div className="p-3 border-b border-gray-200 flex items-center gap-2">
              <span className="text-xs text-gray-500">
                双击节点编辑文本 • 拖拽移动节点 • 点击选择节点
              </span>
            </div>

            {/* 画布 */}
            <div 
              ref={canvasRef}
              className="flex-1 relative bg-gray-50 overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {renderConnections()}
              {nodes.map(renderNode)}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={saveFlowchart}
            className="px-4 py-2 text-sm text-white bg-purple-600 rounded hover:bg-purple-700"
          >
            保存流程图
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowchartEditor;
