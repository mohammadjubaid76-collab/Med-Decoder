/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { sampleReports } from '../data/sampleReports';
import { samplePrescriptions } from '../data/samplePrescriptions';
import {
  Settings,
  Languages,
  User,
  Volume2,
  Trash2,
  Save,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, showToast, t } = useApp();

  const [patientName, setPatientName] = useState('Ramesh Patel');
  const [patientAge, setPatientAge] = useState('46');
  const [patientGender, setPatientGender] = useState('Male');
  const [enableAudio, setEnableAudio] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    showToast('Preferences and profile saved!', 'success');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDemoData = () => {
    localStorage.removeItem('med_decoder_reports');
    localStorage.removeItem('med_decoder_prescriptions');
    window.location.reload();
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {t.navSettings}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure preferred vernacular language, patient details, and local privacy options.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Language Preference Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Languages className="w-4 h-4 text-[#2563EB]" />
            <h3>Default Vernacular Language</h3>
          </div>
          <p className="text-xs text-slate-500">
            Select the primary language in which test explanations and doctor questions are presented.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {[
              { code: 'en' as Language, label: 'English', native: 'English' },
              { code: 'hi' as Language, label: 'Hindi', native: 'हिंदी' },
              { code: 'mr' as Language, label: 'Marathi', native: 'मराठी' },
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  language === lang.code
                    ? 'border-[#2563EB] bg-blue-50/70 text-[#123B66] font-semibold ring-1 ring-[#2563EB]'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className="text-base font-bold">{lang.native}</div>
                <div className="text-xs text-slate-500">{lang.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <User className="w-4 h-4 text-[#2563EB]" />
            <h3>Patient Demographic Profile</h3>
          </div>
          <p className="text-xs text-slate-500">
            Age and gender ensure automated calibration against the correct demographic reference intervals.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age (Years)
              </label>
              <input
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gender
              </label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB] bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Volume2 className="w-4 h-4 text-[#2563EB]" />
            <h3>Audio & Readability Assist</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Vernacular Audio Narration
              </p>
              <p className="text-[11px] text-slate-500">
                Play spoken voice summary in Hindi or Marathi for elders and non-reading family members.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEnableAudio(!enableAudio)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                enableAudio ? 'bg-[#2563EB]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  enableAudio ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetDemoData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Reports</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#123B66] hover:bg-[#1a4a7d] rounded-lg shadow-xs transition-all"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
