/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

// Environment variables with fallback to user's configured med-decoder credentials
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBsaBy566wBVX8BzvhrnaUeGyAYlg4JGGg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "med-decoder.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "med-decoder",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "med-decoder.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1021796126514",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1021796126514:web:6260cf58f7bc3224fd112b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0DH2HLGBRL",
};

// Initialize Firebase instance safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User,
};
