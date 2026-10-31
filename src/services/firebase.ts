/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  User,
} from '../firebase/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { LabReport, PrescriptionAnalysis } from '../types';

export { auth, db, googleProvider };
export type { User };

export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Save or sync a Lab Report to Firestore for the authenticated user
 */
export async function syncReportToFirestore(userId: string, report: LabReport): Promise<void> {
  try {
    const reportRef = doc(db, 'users', userId, 'reports', report.id);
    await setDoc(reportRef, {
      ...report,
      userId,
      syncedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error syncing report to Firestore:', error);
    throw error;
  }
}

/**
 * Fetch all reports for the user from Firestore
 */
export async function fetchReportsFromFirestore(userId: string): Promise<LabReport[]> {
  try {
    const reportsRef = collection(db, 'users', userId, 'reports');
    const snapshot = await getDocs(reportsRef);
    const reports: LabReport[] = [];
    snapshot.forEach((docSnap) => {
      reports.push(docSnap.data() as LabReport);
    });
    return reports;
  } catch (error) {
    console.warn('Could not fetch from Firestore, falling back to local data:', error);
    return [];
  }
}

/**
 * Delete a report from Firestore
 */
export async function deleteReportFromFirestore(userId: string, reportId: string): Promise<void> {
  try {
    const reportRef = doc(db, 'users', userId, 'reports', reportId);
    await deleteDoc(reportRef);
  } catch (error) {
    console.error('Error deleting report from Firestore:', error);
    throw error;
  }
}

/**
 * Save or sync a Prescription Analysis to Firestore
 */
export async function syncPrescriptionToFirestore(userId: string, rx: PrescriptionAnalysis): Promise<void> {
  try {
    const rxRef = doc(db, 'users', userId, 'prescriptions', rx.id);
    await setDoc(rxRef, {
      ...rx,
      userId,
      syncedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error syncing prescription to Firestore:', error);
    throw error;
  }
}

/**
 * Fetch all prescriptions for the user from Firestore
 */
export async function fetchPrescriptionsFromFirestore(userId: string): Promise<PrescriptionAnalysis[]> {
  try {
    const rxRef = collection(db, 'users', userId, 'prescriptions');
    const snapshot = await getDocs(rxRef);
    const prescriptions: PrescriptionAnalysis[] = [];
    snapshot.forEach((docSnap) => {
      prescriptions.push(docSnap.data() as PrescriptionAnalysis);
    });
    return prescriptions;
  } catch (error) {
    console.warn('Could not fetch prescriptions from Firestore:', error);
    return [];
  }
}
