import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Calculator, Beaker, Atom, Zap, Thermometer, Wind, Image, Tag } from 'lucide-react';

interface FormulaEditorProps {
  content: string;
  onChange: (content: string) => void;
  onClose: () => void;
  tags?: string[];
  onTagsChange?: (tags: string[]) => void;
  originalImage?: string; // 原始图片URL
  title?: string;
  onTitleChange?: (title: string) => void;
}

const FormulaEditor: React.FC<FormulaEditorProps> = ({
  content,
  onChange,
  onClose,
  tags = [],
  onTagsChange,
  originalImage,
  title = '',
  onTitleChange
}) => {
  const [formula, setFormula] = useState(content);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [editingTags, setEditingTags] = useState<string[]>([...tags]);
  const [newTag, setNewTag] = useState('');
  const [editingTitle, setEditingTitle] = useState(title);

  // 常用化学元素和符号
  const chemicalElements = [
    'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
    'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Fe', 'Cu', 'Zn', 'Ag', 'Au', 'Hg', 'Pb', 'SO₂', 'NO₂', 'CO₂',
    'NH₃', 'H₂O', 'CH₄', 'C₂H₆', 'C₆H₆', 'CaCO₃', 'NaCl', 'HCl'
  ];

  // 数学符号和运算符
  const mathSymbols = [
    '×', '÷', '±', '≤', '≥', '≠', '≈', '∞', '∑', '∫',
    'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'σ',
    '₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉',
    '⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'
  ];

  // 环境评价常用单位和符号
  const envUnits = [
    'mg/L', 'μg/m³', 'mg/m³', 'ppm', 'ppb', 'mg/kg', 'μg/g',
    'kPa', 'MPa', 'Pa', 'dB(A)', 'Lux', '°C', 'pH', 'BOD₅',
    'COD', 'SS', 'TN', 'TP', 'NH₃-N', 'NO₃-N', 'Pb', 'Cd',
    'Hg', 'As', 'Cr⁶⁺', 'SO₄²⁻', 'Cl⁻', 'F⁻'
  ];

  // 常用公式模板
  const formulaTemplates = [
    {
      name: '污染物浓度计算',
      formula: 'C = (m × 10⁶) / V',
      description: 'C-浓度(mg/L), m-质量(g), V-体积(L)'
    },
    {
      name: '排放速率计算',
      formula: 'Q = C × V × 10⁻⁶',
      description: 'Q-排放速率(kg/h), C-浓度(mg/m³), V-风量(m³/h)'
    },
    {
      name: '去除效率计算',
      formula: 'η = (C₁ - C₂) / C₁ × 100%',
      description: 'η-去除效率(%), C₁-进口浓度, C₂-出口浓度'
    },
    {
      name: '稀释倍数计算',
      formula: 'n = Q₀ / Q',
      description: 'n-稀释倍数, Q₀-受纳水体流量, Q-废水流量'
    },
    {
      name: '噪声叠加公式',
      formula: 'L = 10 × lg(∑10^(Lᵢ/10))',
      description: 'L-总声级(dB), Lᵢ-各声源声级(dB)'
    }
  ];

  // 插入符号到光标位置
  const insertSymbol = (symbol: string) => {
    const newFormula = formula.slice(0, cursorPosition) + symbol + formula.slice(cursorPosition);
    setFormula(newFormula);
    setCursorPosition(cursorPosition + symbol.length);
  };

  // 插入公式模板
  const insertTemplate = (template: string) => {
    const newFormula = formula + (formula ? '\n' : '') + template;
    setFormula(newFormula);
    setCursorPosition(newFormula.length);
  };

  // 清空公式
  const clearFormula = () => {
    setFormula('');
    setCursorPosition(0);
  };

  // 添加标签
  const addTag = () => {
    if (newTag.trim() && !editingTags.includes(newTag.trim())) {
      const updatedTags = [...editingTags, newTag.trim()];
      setEditingTags(updatedTags);
      setNewTag('');
    }
  };

  // 删除标签
  const removeTag = (index: number) => {
    const updatedTags = editingTags.filter((_, i) => i !== index);
    setEditingTags(updatedTags);
  };

  // 处理回车键添加标签
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // 保存公式、标签和标题
  const saveFormula = () => {
    onChange(formula);
    if (onTagsChange) {
      onTagsChange(editingTags);
    }
    if (onTitleChange) {
      onTitleChange(editingTitle);
    }
    onClose();
  };

  // 处理文本区域变化
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormula(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  // 处理光标位置变化
  const handleCursorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.target.selectionStart);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 flex-1">
            <Calculator className="h-5 w-5 text-orange-500" />
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-gray-900">环境评价公式编辑器</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">标题:</span>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  placeholder="输入公式标题..."
                  className="text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[200px]"
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
            <div className="h-1/2 border-b border-gray-200 overflow-hidden">
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
                    alt="原始公式图片"
                    className="w-full h-auto rounded border border-gray-200"
                  />
                ) : (
                  <div className="flex items-center justify-center h-32 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">暂无原始图片</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 下半部分：标签管理 */}
            <div className="h-1/2 overflow-hidden">
              <div className="p-3 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-green-500" />
                  标签管理
                </h3>
              </div>
              <div className="p-3 h-full overflow-auto">
                {/* 添加标签 */}
                <div className="mb-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleTagKeyPress}
                      placeholder="输入新标签..."
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                      onClick={addTag}
                      className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      添加
                    </button>
                  </div>
                </div>

                {/* 标签列表 */}
                <div className="space-y-1">
                  {editingTags.map((tag, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 px-2 py-1 rounded">
                      <span className="text-xs text-green-800">{tag}</span>
                      <button
                        onClick={() => removeTag(index)}
                        className="text-green-600 hover:text-red-600 ml-1"
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

          {/* 右侧面板：符号和编辑器 */}
          <div className="flex-1 flex">
            {/* 符号面板 */}
            <div className="w-72 border-r border-gray-200 overflow-y-auto">
              <div className="p-4 space-y-4">
              {/* 化学元素 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Beaker className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm font-medium text-gray-900">化学元素</h3>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {chemicalElements.map((element, index) => (
                    <button
                      key={index}
                      onClick={() => insertSymbol(element)}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                    >
                      {element}
                    </button>
                  ))}
                </div>
              </div>

              {/* 数学符号 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-4 w-4 text-green-500" />
                  <h3 className="text-sm font-medium text-gray-900">数学符号</h3>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {mathSymbols.map((symbol, index) => (
                    <button
                      key={index}
                      onClick={() => insertSymbol(symbol)}
                      className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* 环境单位 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="h-4 w-4 text-purple-500" />
                  <h3 className="text-sm font-medium text-gray-900">环境单位</h3>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {envUnits.map((unit, index) => (
                    <button
                      key={index}
                      onClick={() => insertSymbol(unit)}
                      className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* 公式模板 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <h3 className="text-sm font-medium text-gray-900">常用公式</h3>
                </div>
                <div className="space-y-2">
                  {formulaTemplates.map((template, index) => (
                    <div key={index} className="border border-gray-200 rounded p-2">
                      <div className="text-xs font-medium text-gray-900 mb-1">
                        {template.name}
                      </div>
                      <div className="text-xs text-gray-600 mb-2 font-mono">
                        {template.formula}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {template.description}
                      </div>
                      <button
                        onClick={() => insertTemplate(template.formula)}
                        className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded hover:bg-orange-100"
                      >
                        插入公式
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>

            {/* 右侧：编辑区域 */}
          <div className="flex-1 flex flex-col">
            {/* 工具栏 */}
            <div className="p-3 border-b border-gray-200 flex items-center gap-2">
              <button
                onClick={clearFormula}
                className="px-3 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100"
              >
                清空
              </button>
              <div className="text-xs text-gray-500">
                光标位置: {cursorPosition}
              </div>
            </div>

            {/* 编辑器 */}
            <div className="flex-1 p-4">
              <textarea
                value={formula}
                onChange={handleTextChange}
                onSelect={handleCursorChange}
                className="w-full h-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
                placeholder="在此输入或编辑公式...

示例：
C = (m × 10⁶) / V
其中：C - 浓度(mg/L)
     m - 质量(g)  
     V - 体积(L)"
              />
            </div>

            {/* 预览区域 */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-2">公式预览：</h4>
              <div className="bg-white p-3 rounded border min-h-[60px] font-mono text-sm whitespace-pre-wrap">
                {formula || '公式预览将在此显示...'}
              </div>
            </div>
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
            onClick={saveFormula}
            className="px-4 py-2 text-sm text-white bg-orange-600 rounded hover:bg-orange-700"
          >
            保存公式
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormulaEditor;
