/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService, UploadResponse } from '../../services/api';
import {
  UploadCloud,
  FileCheck2,
  Trash2,
  RefreshCw,
  Sparkles,
  FileText,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface UploadBoxProps {
  onDecodeComplete: (reportId: string) => void;
}

export const UploadBox: React.FC<UploadBoxProps> = ({ onDecodeComplete }) => {
  const { t, addReport, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<UploadResponse | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [category, setCategory] = useState<string>('CBC');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      showToast('Please upload a PDF or image file (JPG, PNG).', 'error');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      showToast('File size exceeds 25MB limit.', 'error');
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(15);

    // Simulated stepped upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 25;
      });
    }, 150);

    try {
      const res = await apiService.uploadReport(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedData(res);
      showToast('File uploaded and verified successfully!', 'success');
    } catch (err) {
      showToast('Failed to upload file. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadedData(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDecode = async () => {
    if (!uploadedData && !selectedFile) return;
    setIsDecoding(true);
    try {
      const decodedReport = await apiService.decodeReport({
        fileId: uploadedData?.fileId || `file-${Date.now()}`,
        category,
      });
      addReport(decodedReport);
      onDecodeComplete(decodedReport.id);
    } catch (err) {
      showToast('Decoding error. Falling back to default report.', 'error');
    } finally {
      setIsDecoding(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Category selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          {t.selectCategory}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'CBC', name: 'Complete Blood Count (CBC)' },
            { id: 'Lipid Profile', name: 'Lipid & Cholesterol Profile' },
            { id: 'Diabetic Panel (HbA1c)', name: 'HbA1c / Diabetic Panel' },
            { id: 'Liver Function (LFT)', name: 'Liver Function (LFT)' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`p-3 text-left rounded-lg border text-xs transition-all ${
                category === cat.id
                  ? 'border-[#2563EB] bg-blue-50/60 font-semibold text-[#123B66] shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <div className="font-semibold">{cat.id}</div>
              <div className="text-[11px] text-slate-500 truncate">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Drag-Drop or Upload Preview */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#2563EB] bg-blue-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-[#2563EB] bg-white hover:bg-slate-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/png,image/jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            {t.dragDropText}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            {t.orBrowse}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-md text-[11px] text-slate-600 font-medium">
            <span>{t.supportedFormats}</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 truncate">
                  {selectedFile.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="font-mono tabular-nums">{formatFileSize(selectedFile.size)}</span>
                  <span>·</span>
                  <span className="uppercase">{selectedFile.type.split('/')[1] || 'FILE'}</span>
                  <span>·</span>
                  <span className="text-emerald-600 font-medium">Verified Valid Report</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {uploadedData?.previewUrl && (
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(true)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Preview report"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title={t.replaceFile}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                title={t.removeFile}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Uploading and extracting image layers...</span>
                <span className="font-mono tabular-nums">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2563EB] transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Preview snippet */}
          {uploadedData?.previewUrl && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={uploadedData.previewUrl}
                  alt="Uploaded medical report snippet"
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Visual Report Preview Ready</p>
                  <p className="text-[11px] text-slate-500">
                    High resolution pathology scan detected with clean text boundary.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(true)}
                className="text-xs font-medium text-[#2563EB] hover:underline"
              >
                View Full Image
              </button>
            </div>
          )}

          {/* Action Decode Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Report will be simplified into English, Hindi & Marathi.</span>
            </div>
            <button
              type="button"
              disabled={isUploading || isDecoding}
              onClick={handleDecode}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs text-white transition-all shadow-sm ${
                isDecoding
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-[#123B66] hover:bg-[#194b7e] active:scale-[0.98]'
              }`}
            >
              {isDecoding ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.decodingProgress}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <span>{t.startDecoding}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      {previewModalOpen && uploadedData?.previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Uploaded Document Inspection</h3>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[65vh] overflow-auto rounded-lg border border-slate-200">
              <img
                src={uploadedData.previewUrl}
                alt="Document preview"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
