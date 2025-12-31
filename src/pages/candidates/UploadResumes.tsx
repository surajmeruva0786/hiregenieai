import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, File, CheckCircle2, X, AlertCircle } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export default function UploadResumes() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload and processing
    newFiles.forEach((file) => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id === fileId && f.status === 'uploading') {
            const newProgress = Math.min(f.progress + 10, 100);
            if (newProgress === 100) {
              return { ...f, status: 'processing', progress: newProgress };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        })
      );
    }, 300);

    // Simulate processing
    setTimeout(() => {
      clearInterval(uploadInterval);
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id === fileId) {
            // 90% success rate
            const success = Math.random() > 0.1;
            return {
              ...f,
              status: success ? 'completed' : 'error',
              progress: 100,
              error: success ? undefined : 'Failed to parse resume',
            };
          }
          return f;
        })
      );
    }, 4000);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const completedFiles = files.filter((f) => f.status === 'completed').length;
  const errorFiles = files.filter((f) => f.status === 'error').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/candidates')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-gray-900 mb-2">Upload Resumes</h1>
          <p className="text-gray-600">Upload candidate resumes for AI-powered screening</p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`bg-white rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <p className="text-gray-900 mb-1">
              Drag and drop your resume files here
            </p>
            <p className="text-gray-600">or</p>
          </div>
          <label className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors">
            Browse Files
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
          <p className="text-gray-500">Supports PDF, DOC, DOCX (Max 10MB per file)</p>
        </div>
      </div>

      {/* Upload Progress */}
      {files.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">Upload Progress</h2>
            <div className="flex gap-4 text-sm">
              {completedFiles > 0 && (
                <span className="text-green-600">
                  {completedFiles} completed
                </span>
              )}
              {errorFiles > 0 && (
                <span className="text-red-600">
                  {errorFiles} failed
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  file.status === 'completed' ? 'bg-green-100' :
                  file.status === 'error' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  {file.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : file.status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <File className="w-5 h-5 text-blue-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-900 truncate">{file.name}</p>
                    <span className="text-gray-600 ml-4">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  
                  {file.status === 'error' ? (
                    <p className="text-red-600">{file.error}</p>
                  ) : file.status === 'completed' ? (
                    <p className="text-green-600">Resume parsed successfully</p>
                  ) : (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {file.status === 'uploading' ? 'Uploading...' : 'Processing with AI...'}
                      </p>
                    </>
                  )}
                </div>

                <button
                  onClick={() => removeFile(file.id)}
                  className="p-2 hover:bg-gray-200 rounded-lg flex-shrink-0"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            ))}
          </div>

          {completedFiles > 0 && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => navigate('/dashboard/candidates')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                View Candidates
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-blue-900 mb-3">How it works</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>Upload single or multiple resume files at once</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>Our AI will automatically extract candidate information, skills, and experience</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>Candidates will be matched with relevant job postings automatically</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>Review AI-generated scores and insights in the candidates section</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
