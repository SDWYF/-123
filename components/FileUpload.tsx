import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, Loader2 } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { TaxRecord } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: TaxRecord[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError("请上传 Excel 文件 (.xlsx 或 .xls)");
      return;
    }

    setLoading(true);
    try {
      const data = await parseExcelFile(file);
      if (data.length === 0) {
          setError("文件中未找到有效数据，请检查表头是否匹配。");
      } else {
          onDataLoaded(data);
      }
    } catch (err) {
      console.error(err);
      setError("解析文件失败，请确保文件格式正确且未加密。");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 px-4">
      <div 
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ease-in-out
          ${isDragOver ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-300 bg-white hover:border-gray-400'}
          ${loading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${isDragOver ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {loading ? (
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            ) : (
                <FileSpreadsheet className={`h-10 w-10 ${isDragOver ? 'text-blue-600' : 'text-gray-400'}`} />
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {loading ? "正在解析数据..." : "上传台账 Excel 文件"}
            </h3>
            <p className="text-sm text-gray-500">
              拖拽文件到此处，或点击下方按钮选择
            </p>
          </div>

          <label className="relative cursor-pointer">
            <span className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center gap-2">
              <Upload className="w-4 h-4" />
              选择文件
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept=".xlsx,.xls" 
              onChange={onFileChange} 
            />
          </label>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{error}</p>
            </div>
        )}
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">支持的列名（必须包含）</h4>
            <div className="flex flex-wrap gap-2">
                {['序号', '课征主体登记类型', '主管税务机关', '业务类型1', '受理人', '是否办成', '办理时长（超20分钟业务填写）', '进厅原因', '是否引导体验征纳互动', '备注'].map(col => (
                    <span key={col} className="px-2 py-1 bg-white text-gray-600 text-xs rounded border border-gray-200">
                        {col}
                    </span>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
