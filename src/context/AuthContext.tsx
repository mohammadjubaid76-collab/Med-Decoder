/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User,
} from '../firebase/firebase';
import { db } from '../firebase/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export type UserRole = 'user' | 'admin';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  role: UserRole | null;
  signup: (name: string, email: string, pass: string) => Promise<User>;
  login: (email: string, pass: string, remember?: boolean) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  loginAsAdmin: (email: string, pass: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }
      const token = await user.getIdTokenResult();
      setRole(token.claims.role === 'admin' ? 'admin' : 'user');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  const ensureUserProfile = async (user: User, name?: string): Promise<void> => {
    const profileRef = doc(db, 'users', user.uid);
    const existing = await getDoc(profileRef);
    const token = await user.getIdTokenResult();
    const admin = token.claims.role === 'admin';
    await setDoc(profileRef, {
      uid: user.uid,
      name: name?.trim() || user.displayName || existing.data()?.name || '',
      email: user.email || '',
      role: admin ? 'admin' : 'user',
      disabled: false,
      updatedAt: serverTimestamp(),
      createdAt: existing.exists() ? existing.data()?.createdAt || serverTimestamp() : serverTimestamp(),
    }, { merge: true });
  };

  /**
   * Translates Firebase error codes to patient-friendly explanations
   */
  const formatFirebaseError = (error: any): string => {
    const code = error?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please verify and try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please log in instead.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completing authentication.';
      case 'auth/network-request-failed':
        return 'Network connection error. Please check your internet connectivity.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful attempts. Access temporarily restricted for security; please try again later.';
      default:
        return error?.message || 'Authentication error occurred. Please try again.';
    }
  };

  const signup = async (name: string, email: string, pass: string): Promise<User> => {
    clearAuthError();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      // Update displayName
      await updateProfile(user, {
        displayName: name.trim(),
      });
      await ensureUserProfile(user, name);

      // Send email verification
      try {
        await sendEmailVerification(user);
      } catch (verifyErr) {
        console.warn('Could not send verification email immediately:', verifyErr);
      }

      return user;
    } catch (err: any) {
      const friendlyMsg = formatFirebaseError(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const login = async (email: string, pass: string, remember = true): Promise<User> => {
    clearAuthError();
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const token = await userCredential.user.getIdTokenResult(true);
      if (token.claims.role === 'admin') {
        await signOut(auth);
        const error = 'Administrator accounts must use the Administrator Login.';
        setAuthError(error);
        throw new Error(error);
      }
      await ensureUserProfile(userCredential.user);
      return userCredential.user;
    } catch (err: any) {
      const friendlyMsg = formatFirebaseError(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const loginWithGoogle = async (): Promise<User> => {
    clearAuthError();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdTokenResult(true);
      if (token.claims.role === 'admin') {
        await signOut(auth);
        const error = 'Administrator accounts must use the Administrator Login.';
        setAuthError(error);
        throw new Error(error);
      }
      await ensureUserProfile(result.user);
      return result.user;
    } catch (err: any) {
      const friendlyMsg = formatFirebaseError(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const loginAsAdmin = async (email: string, pass: string): Promise<User> => {
    clearAuthError();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const token = await userCredential.user.getIdTokenResult(true);
      if (token.claims.role !== 'admin') {
        await signOut(auth);
        const error = 'This account is not authorized for admin access.';
        setAuthError(error);
        throw new Error(error);
      }
      setRole('admin');
      return userCredential.user;
    } catch (err: any) {
      if (err?.message === 'This account is not authorized for admin access.') throw err;
      const friendlyMsg = formatFirebaseError(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const logout = async (): Promise<void> => {
    clearAuthError();
    try {
      await signOut(auth);
    } catch (err: any) {
      const friendlyMsg = formatFirebaseError(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    clearAuthError();
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      const friendlyMsg = formatFirebaseError(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const resendVerificationEmail = async (): Promise<void> => {
    if (!currentUser) throw new Error('No user is currently signed in');
    try {
      await sendEmailVerification(currentUser);
    } catch (err: any) {
      const friendlyMsg = formatFirebaseError(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        role,
        signup,
        login,
        loginWithGoogle,
        loginAsAdmin,
        logout,
        resetPassword,
        resendVerificationEmail,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
