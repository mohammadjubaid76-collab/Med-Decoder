/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LabReport, PrescriptionAnalysis } from '../types';
import { sampleReports } from '../data/sampleReports';
import { samplePrescriptions } from '../data/samplePrescriptions';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

export interface UploadResponse {
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  previewUrl?: string;
  uploadTimestamp: string;
}

export interface DecodeReportPayload {
  fileId: string;
  category?: string;
  userNotes?: string;
}

export interface DecodePrescriptionPayload {
  fileId: string;
  doctorSpecialty?: string;
}

export const apiService = {
  /**
   * POST /api/reports/upload
   * Handles uploading document or image to server/storage
   */
  async uploadReport(file: File): Promise<UploadResponse> {
    try {
      // If a real backend server exists:
      if ((import.meta as any).env?.VITE_USE_REAL_BACKEND === 'true') {
        const formData = new FormData();
        formData.append('reportFile', file);
        const res = await fetch(`${API_BASE_URL}/reports/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);
        return await res.json();
      }
    } catch (err) {
      console.warn('Real API unavailable, utilizing browser client simulated handler:', err);
    }

    // Client-side simulation fallback for instant evaluation
    await new Promise((r) => setTimeout(r, 600));
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
    return {
      fileId: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      previewUrl,
      uploadTimestamp: new Date().toISOString(),
    };
  },

  /**
   * POST /api/reports/decode
   * Processes optical characters and normalizes lab metrics
   */
  async decodeReport(payload: DecodeReportPayload): Promise<LabReport> {
    try {
      if ((import.meta as any).env?.VITE_USE_REAL_BACKEND === 'true') {
        const res = await fetch(`${API_BASE_URL}/reports/decode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Decode failed with status ${res.status}`);
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend decode unavailable, using clinical engine fallback:', err);
    }

    // Realistic processing pause to simulate OCR extraction & clinical normalization
    await new Promise((r) => setTimeout(r, 1200));

    // Choose relevant sample based on category or default to CBC
    if (payload.category === 'Lipid Profile') {
      return { ...sampleReports[1], id: `rep-${Date.now()}`, isDemo: true };
    } else if (payload.category?.includes('Diabetic') || payload.category?.includes('HbA1c')) {
      return { ...sampleReports[2], id: `rep-${Date.now()}`, isDemo: true };
    }

    // Default CBC with custom unique ID
    return {
      ...sampleReports[0],
      id: `rep-${Date.now()}`,
      isDemo: true,
    };
  },

  /**
   * POST /api/prescriptions/decode
   * Decodes handwritten prescription images
   */
  async decodePrescription(payload: DecodePrescriptionPayload): Promise<PrescriptionAnalysis> {
    try {
      if ((import.meta as any).env?.VITE_USE_REAL_BACKEND === 'true') {
        const res = await fetch(`${API_BASE_URL}/prescriptions/decode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Prescription decode failed with status ${res.status}`);
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend prescription decode unavailable, using demo engine:', err);
    }

    await new Promise((r) => setTimeout(r, 1200));
    return {
      ...samplePrescriptions[0],
      id: `rx-${Date.now()}`,
      isDemo: true,
    };
  },

  /**
   * GET /api/reports
   * Retrieves list of user's decoded reports
   */
  async getReports(): Promise<LabReport[]> {
    try {
      if ((import.meta as any).env?.VITE_USE_REAL_BACKEND === 'true') {
        const res = await fetch(`${API_BASE_URL}/reports`);
        if (res.ok) return await res.json();
      }
    } catch (err) {
      console.warn('Failed to fetch remote reports:', err);
    }
    return sampleReports;
  },

  /**
   * GET /api/reports/:id
   */
  async getReportById(id: string): Promise<LabReport | undefined> {
    try {
      if ((import.meta as any).env?.VITE_USE_REAL_BACKEND === 'true') {
        const res = await fetch(`${API_BASE_URL}/reports/${id}`);
        if (res.ok) return await res.json();
      }
    } catch (err) {
      console.warn('Failed to fetch remote report by ID:', err);
    }
    return sampleReports.find((r) => r.id === id) || sampleReports[0];
  },
};
