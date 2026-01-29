import { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import type { UploadedFile } from '../types';

interface FileUploadProps {
  onFileSelect: (file: UploadedFile | null) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.glb')) {
        alert('Please upload a .glb file');
        return;
      }

      const uploadedFile: UploadedFile = {
        file,
        preview: URL.createObjectURL(file),
        size: file.size,
      };

      setSelectedFile(uploadedFile);
      onFileSelect(uploadedFile);
    },
    [onFileSelect]
  );

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".glb"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-lg font-medium text-gray-900">
            Drop your GLB file here
          </p>
          <p className="mt-2 text-sm text-gray-500">
            or click to browse (max 100MB)
          </p>
        </div>
      ) : (
        <div className="relative border-2 border-green-500 rounded-lg p-6 bg-green-50">
          <button
            onClick={handleRemove}
            className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-2xl text-white">📦</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-900 truncate">
                {selectedFile.file.name}
              </p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
