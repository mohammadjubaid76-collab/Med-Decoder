/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PrescriptionUploadBox } from '../components/prescription/PrescriptionUploadBox';
import { PrescriptionCard } from '../components/prescription/PrescriptionCard';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import { FileSignature, ShieldCheck, AlertCircle } from 'lucide-react';

export const PrescriptionDecoderPage: React.FC = () => {
  const { t, activePrescription, prescriptions } = useApp();
  const [selectedRx, setSelectedRx] = useState(activePrescription || prescriptions[0]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#14B8A6] uppercase tracking-wider mb-1">
          <FileSignature className="w-4 h-4" />
          <span>Clinical OCR & Handwriting Safety Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t.prescriptionTitle}
        </h1>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          {t.prescriptionSubtitle}
        </p>
      </div>

      {/* Upload & Photo Scan Component */}
      <PrescriptionUploadBox
        onDecodeComplete={(rxId) => {
          const found = prescriptions.find((p) => p.id === rxId);
          if (found) setSelectedRx(found);
        }}
      />

      {/* Analysis Results */}
      {selectedRx && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <PrescriptionCard prescription={selectedRx} />
        </div>
      )}

      {/* Medical Safety Disclaimer */}
      <MedicalDisclaimer isDemo={true} />
    </div>
  );
};
