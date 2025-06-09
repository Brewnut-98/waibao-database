import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, Undo, Redo } from 'lucide-react';

interface TableCell {
  content: string;
  rowSpan: number;
  colSpan: number;
  isHidden: boolean; // 被合并的单元格标记为隐藏
}

interface TableEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TableEditor: React.FC<TableEditorProps> = ({ content, onChange }) => {
  const [tableData, setTableData] = useState<TableCell[][]>([]);
  const [selectedCells, setSelectedCells] = useState<{row: number, col: number}[]>([]);

  // 撤销重做功能
  const [history, setHistory] = useState<TableCell[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // 解析表格内容为二维数组
  useEffect(() => {
    const rows = content.split('\n').filter(row => row.trim());
    if (rows.length === 0) {
      // 如果没有内容，创建一个默认的2x2表格
      setTableData([
        [
          { content: '标题1', rowSpan: 1, colSpan: 1, isHidden: false },
          { content: '标题2', rowSpan: 1, colSpan: 1, isHidden: false }
        ],
        [
          { content: '', rowSpan: 1, colSpan: 1, isHidden: false },
          { content: '', rowSpan: 1, colSpan: 1, isHidden: false }
        ]
      ]);
      return;
    }

    const parsedData: TableCell[][] = rows.map(row => 
      row.split(' | ').map(cell => ({
        content: cell.trim(),
        rowSpan: 1,
        colSpan: 1,
        isHidden: false
      }))
    );

    // 确保所有行都有相同的列数
    const maxCols = Math.max(...parsedData.map(row => row.length));
    const normalizedData = parsedData.map(row => {
      while (row.length < maxCols) {
        row.push({
          content: '',
          rowSpan: 1,
          colSpan: 1,
          isHidden: false
        });
      }
      return row;
    });

    setTableData(normalizedData);

    // 初始化历史记录
    if (history.length === 0) {
      setHistory([JSON.parse(JSON.stringify(normalizedData))]);
      setHistoryIndex(0);
    }
  }, [content]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            undo();
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // 将表格数据转换回字符串格式
  const tableToString = (data: TableCell[][]): string => {
    return data.map(row => {
      const visibleCells = [];
      for (let i = 0; i < row.length; i++) {
        if (!row[i].isHidden) {
          visibleCells.push(row[i].content);
        }
      }
      return visibleCells.join(' | ');
    }).filter(row => row.trim()).join('\n');
  };

  // 保存历史记录
  const saveToHistory = useCallback((data: TableCell[][]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(data))); // 深拷贝

    // 限制历史记录数量
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }

    setHistory(newHistory);
  }, [history, historyIndex]);

  // 更新表格数据并通知父组件
  const updateTableData = useCallback((newData: TableCell[][], saveHistory = true) => {
    if (saveHistory) {
      saveToHistory(tableData);
    }
    setTableData(newData);
    onChange(tableToString(newData));
  }, [tableData, saveToHistory, onChange]);

  // 处理单元格内容变化
  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex].content = value;
    updateTableData(newData);
  };

  // 处理单元格选择
  const handleCellClick = (rowIndex: number, colIndex: number, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // 多选模式
      const cellKey = {row: rowIndex, col: colIndex};
      const isSelected = selectedCells.some(cell => cell.row === rowIndex && cell.col === colIndex);
      
      if (isSelected) {
        setSelectedCells(selectedCells.filter(cell => !(cell.row === rowIndex && cell.col === colIndex)));
      } else {
        setSelectedCells([...selectedCells, cellKey]);
      }
    } else {
      // 单选模式
      setSelectedCells([{row: rowIndex, col: colIndex}]);
    }
  };



  // 添加行
  const addRow = () => {
    const newData = [...tableData];
    const colCount = newData[0]?.length || 1;
    const newRow = Array(colCount).fill(null).map(() => ({
      content: '',
      rowSpan: 1,
      colSpan: 1,
      isHidden: false
    }));
    newData.push(newRow);
    updateTableData(newData);
  };

  // 添加列
  const addColumn = () => {
    const newData = tableData.map(row => [
      ...row,
      {
        content: '',
        rowSpan: 1,
        colSpan: 1,
        isHidden: false
      }
    ]);
    updateTableData(newData);
  };

  // 撤销
  const undo = () => {
    if (historyIndex > 0) {
      const previousData = history[historyIndex - 1];
      setTableData(JSON.parse(JSON.stringify(previousData)));
      setHistoryIndex(historyIndex - 1);
      onChange(tableToString(previousData));
      setSelectedCells([]);
    }
  };

  // 重做
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextData = history[historyIndex + 1];
      setTableData(JSON.parse(JSON.stringify(nextData)));
      setHistoryIndex(historyIndex + 1);
      onChange(tableToString(nextData));
      setSelectedCells([]);
    }
  };

  // 删除选中的行
  const deleteRows = () => {
    if (selectedCells.length === 0) return;

    const rowsToDelete = [...new Set(selectedCells.map(cell => cell.row))].sort((a, b) => b - a);
    let newData = [...tableData];

    // 从后往前删除，避免索引变化
    for (const rowIndex of rowsToDelete) {
      if (newData.length > 1) { // 至少保留一行
        newData.splice(rowIndex, 1);
      }
    }

    updateTableData(newData);
    setSelectedCells([]);
  };

  // 删除选中的列
  const deleteColumns = () => {
    if (selectedCells.length === 0) return;

    const colsToDelete = [...new Set(selectedCells.map(cell => cell.col))].sort((a, b) => b - a);
    let newData = [...tableData];

    // 从后往前删除，避免索引变化
    for (const colIndex of colsToDelete) {
      if (newData[0] && newData[0].length > 1) { // 至少保留一列
        newData = newData.map(row => {
          const newRow = [...row];
          newRow.splice(colIndex, 1);
          return newRow;
        });
      }
    }

    updateTableData(newData);
    setSelectedCells([]);
  };

  // 检查单元格是否被选中
  const isCellSelected = (rowIndex: number, colIndex: number) => {
    return selectedCells.some(cell => cell.row === rowIndex && cell.col === colIndex);
  };

  return (
    <div className="bg-white rounded border">
      {/* 工具栏 */}
      <div className="mb-3 flex items-center gap-1 p-3 border-b border-gray-200 flex-wrap">
        {/* 撤销重做 */}
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          title="撤销 (Ctrl+Z)"
        >
          <Undo className="h-3 w-3" />
          撤销
        </button>

        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          title="重做 (Ctrl+Y)"
        >
          <Redo className="h-3 w-3" />
          重做
        </button>

        <div className="w-px h-4 bg-gray-300 mx-1"></div>

        {/* 添加行列 */}
        <button
          onClick={addRow}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
          title="添加行"
        >
          <Plus className="h-3 w-3" />
          添加行
        </button>

        <button
          onClick={addColumn}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
          title="添加列"
        >
          <Plus className="h-3 w-3" />
          添加列
        </button>

        <div className="w-px h-4 bg-gray-300 mx-1"></div>

        {/* 删除行列 */}
        <button
          onClick={deleteRows}
          disabled={selectedCells.length === 0 || tableData.length <= 1}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          title="删除选中的行"
        >
          <Minus className="h-3 w-3" />
          删除行
        </button>

        <button
          onClick={deleteColumns}
          disabled={selectedCells.length === 0 || (tableData[0] && tableData[0].length <= 1)}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          title="删除选中的列"
        >
          <Minus className="h-3 w-3" />
          删除列
        </button>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto px-3 pb-3">
        <table className="min-w-full border-collapse border border-gray-300">
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => {
                  if (cell.isHidden) return null;
                  
                  return (
                    <td
                      key={colIndex}
                      rowSpan={cell.rowSpan}
                      colSpan={cell.colSpan}
                      className={`border border-gray-300 p-1 min-w-[60px] ${
                        isCellSelected(rowIndex, colIndex) 
                          ? 'bg-blue-100 border-blue-400' 
                          : 'hover:bg-gray-50'
                      } ${rowIndex === 0 ? 'bg-gray-100 font-medium' : ''}`}
                      onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
                    >
                      <input
                        type="text"
                        value={cell.content}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs p-1"
                        placeholder="输入内容..."
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableEditor;
