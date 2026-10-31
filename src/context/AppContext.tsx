/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { Language, LabReport, PrescriptionAnalysis } from '../types';
import { sampleReports } from '../data/sampleReports';
import { samplePrescriptions } from '../data/samplePrescriptions';
import { getTranslation } from '../translations';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  syncReportToFirestore,
  fetchReportsFromFirestore,
  deleteReportFromFirestore,
  syncPrescriptionToFirestore,
  fetchPrescriptionsFromFirestore,
} from '../services/firebase';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: ReturnType<typeof getTranslation>;
  currentUser: User | null;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  reports: LabReport[];
  addReport: (report: LabReport) => void;
  deleteReport: (id: string) => void;
  activeReport: LabReport | null;
  setActiveReport: (report: LabReport | null) => void;
  prescriptions: PrescriptionAnalysis[];
  addPrescription: (rx: PrescriptionAnalysis) => void;
  activePrescription: PrescriptionAnalysis | null;
  setActivePrescription: (rx: PrescriptionAnalysis | null) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('med_decoder_lang');
    return (saved === 'hi' || saved === 'mr' || saved === 'en') ? saved : 'en';
  });

  const [reports, setReports] = useState<LabReport[]>(() => {
    const saved = localStorage.getItem('med_decoder_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved reports', e);
      }
    }
    return sampleReports;
  });

  const [activeReport, setActiveReport] = useState<LabReport | null>(sampleReports[0]);

  const [prescriptions, setPrescriptions] = useState<PrescriptionAnalysis[]>(() => {
    const saved = localStorage.getItem('med_decoder_prescriptions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved prescriptions', e);
      }
    }
    return samplePrescriptions;
  });

  const [activePrescription, setActivePrescription] = useState<PrescriptionAnalysis | null>(samplePrescriptions[0]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
      if (user) {
        showToast(`Signed in to Firebase as ${user.displayName || user.email}`, 'success');
        // Fetch existing cloud reports from Firestore
        try {
          const cloudReports = await fetchReportsFromFirestore(user.uid);
          if (cloudReports.length > 0) {
            setReports((prev) => {
              const ids = new Set(cloudReports.map((r) => r.id));
              const nonDuplicatePrev = prev.filter((r) => !ids.has(r.id));
              return [...cloudReports, ...nonDuplicatePrev];
            });
            setActiveReport(cloudReports[0]);
          }

          const cloudRx = await fetchPrescriptionsFromFirestore(user.uid);
          if (cloudRx.length > 0) {
            setPrescriptions((prev) => {
              const ids = new Set(cloudRx.map((p) => p.id));
              const nonDuplicatePrev = prev.filter((p) => !ids.has(p.id));
              return [...cloudRx, ...nonDuplicatePrev];
            });
            setActivePrescription(cloudRx[0]);
          }
        } catch (err) {
          console.warn('Failed to load user data from Firestore:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('med_decoder_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('med_decoder_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('med_decoder_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  const signInWithGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Google sign in error:', err);
      showToast(err.message || 'Firebase Google Sign-In failed', 'error');
    }
  };

  const signOut = async () => {
    try {
      await logoutUser();
      showToast('Signed out from Firebase', 'info');
    } catch (err: any) {
      console.error('Sign out error:', err);
      showToast('Failed to sign out', 'error');
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const names = { en: 'English', hi: 'हिंदी (Hindi)', mr: 'मराठी (Marathi)' };
    showToast(`Language switched to ${names[lang]}`, 'info');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addReport = async (newReport: LabReport) => {
    setReports((prev) => [newReport, ...prev]);
    setActiveReport(newReport);
    showToast('Lab report analyzed successfully!', 'success');

    if (currentUser) {
      try {
        await syncReportToFirestore(currentUser.uid, newReport);
        showToast('Synced report to Firebase Firestore!', 'success');
      } catch (err) {
        console.warn('Could not sync report to Firestore:', err);
      }
    }
  };

  const deleteReport = async (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    if (activeReport?.id === id) {
      setActiveReport(reports[1] || null);
    }
    showToast('Report deleted', 'info');

    if (currentUser) {
      try {
        await deleteReportFromFirestore(currentUser.uid, id);
      } catch (err) {
        console.warn('Could not delete from Firestore:', err);
      }
    }
  };

  const addPrescription = async (rx: PrescriptionAnalysis) => {
    setPrescriptions((prev) => [rx, ...prev]);
    setActivePrescription(rx);
    showToast('Prescription analyzed!', 'success');

    if (currentUser) {
      try {
        await syncPrescriptionToFirestore(currentUser.uid, rx);
        showToast('Synced prescription to Firebase Firestore!', 'success');
      } catch (err) {
        console.warn('Could not sync prescription to Firestore:', err);
      }
    }
  };

  const t = getTranslation(language);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentUser,
        isAuthLoading,
        signInWithGoogle,
        signOut,
        reports,
        addReport,
        deleteReport,
        activeReport,
        setActiveReport,
        prescriptions,
        addPrescription,
        activePrescription,
        setActivePrescription,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
