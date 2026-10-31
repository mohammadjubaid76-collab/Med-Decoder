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
  User,
} from '../firebase/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (name: string, email: string, pass: string) => Promise<User>;
  login: (email: string, pass: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

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

  const login = async (email: string, pass: string): Promise<User> => {
    clearAuthError();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
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
      return result.user;
    } catch (err: any) {
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
        signup,
        login,
        loginWithGoogle,
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
