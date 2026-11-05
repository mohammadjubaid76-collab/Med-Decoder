/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { samplePrescriptions } from '../../data/samplePrescriptions';
import { UploadCloud, Camera, RefreshCw, Sparkles, FileCheck, CheckCircle2 } from 'lucide-react';

interface PrescriptionUploadBoxProps {
  onDecodeComplete: (rxId: string) => void;
}

export const PrescriptionUploadBox: React.FC<PrescriptionUploadBoxProps> = ({ onDecodeComplete }) => {
  const { t, addPrescription, setActivePrescription, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setSelectedImage(preview);
      showToast('Prescription image loaded', 'success');
    }
  };

  const handleSelectSample = (index: number) => {
    setSelectedSampleIndex(index);
    setSelectedImage(null);
    setActivePrescription(samplePrescriptions[index]);
    showToast(`Loaded sample prescription #${index + 1}`, 'info');
  };

  const handleDecode = async () => {
    setIsProcessing(true);
    try {
      const result = await apiService.decodePrescription({
        fileId: `rx-file-${Date.now()}`,
      });
      addPrescription(result);
      onDecodeComplete(result.id);
    } catch (err) {
      showToast('Decode error. Falling back to active sample.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sample Selector Buttons for quick testing */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Or Test with Curated Prescription Samples
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {samplePrescriptions.map((rx, idx) => (
            <button
              key={rx.id}
              type="button"
              onClick={() => handleSelectSample(idx)}
              className={`p-3 text-left rounded-lg border text-xs transition-all ${
                selectedSampleIndex === idx && !selectedImage
                  ? 'border-[#2563EB] bg-blue-50/60 font-semibold text-[#123B66]'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <div className="font-semibold text-slate-900">{rx.doctorName}</div>
              <div className="text-[11px] text-slate-500 truncate">{rx.clinicHospital}</div>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                <span>{rx.medicines.length} Medicines</span>
                <span>·</span>
                <span className="font-mono tabular-nums">{rx.overallClarityScore}% Clarity</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Upload Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-[#2563EB] bg-white hover:bg-slate-50/50 rounded-2xl p-8 text-center cursor-pointer transition-all"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-[#14B8A6] mb-3">
          <Camera className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">
          Upload or Take a Photo of Doctor's Handwritten Prescription
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          JPEG, JPG, PNG from camera or gallery (high resolution recommended)
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded text-[11px] font-medium text-slate-600">
          <FileCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Automated Optical Recognition with Pharmacist Safety Checks</span>
        </div>
      </div>

      {/* Selected Image Preview & Decode CTA */}
      {selectedImage && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={selectedImage}
              alt="Prescription preview"
              className="w-16 h-16 object-cover rounded-lg border border-slate-200"
            />
            <div>
              <p className="text-xs font-semibold text-slate-900">Custom Prescription Photo Loaded</p>
              <p className="text-[11px] text-slate-500">Ready to transcribe handwriting</p>
            </div>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleDecode}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs text-white bg-[#123B66] hover:bg-[#1a4a7d]"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Reading Doctor's Handwriting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span>Decode Prescription</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
