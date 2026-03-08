import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on mount
    if (pb.authStore.isValid && pb.authStore.model) {
      setCurrentUser(pb.authStore.model);
    }
    setInitialLoading(false);
  }, []);

  const signup = async (email, name, password) => {
    try {
      const data = {
        email,
        password: password,
        passwordConfirm: password,
        name: name || email.split('@')[0],
        emailVisibility: true,
        verified: false, // Explicitly set to false initially
      };
      
      const record = await pb.collection('users').create(data, { $autoCancel: false });
      return record;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      // Authenticate to get the record
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      
      // Check if verified
      if (!authData.record.verified) {
        // Clear auth store if not verified so they aren't logged in
        pb.authStore.clear();
        throw new Error("unverified");
      }
      
      setCurrentUser(authData.record);
      
      // Update online status
      await pb.collection('users').update(authData.record.id, {
        online_status: true,
        last_seen: new Date().toISOString(),
      }, { $autoCancel: false });
      
      return authData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (currentUser) {
        await pb.collection('users').update(currentUser.id, {
          online_status: false,
          last_seen: new Date().toISOString(),
        }, { $autoCancel: false });
      }
      
      pb.authStore.clear();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      pb.authStore.clear();
      setCurrentUser(null);
    }
  };

  const verifyEmail = async (userId, token) => {
    try {
      // Fetch the user to check the token
      const user = await pb.collection('users').getOne(userId, { $autoCancel: false });
      
      if (user.verification_token === token) {
        // Update user to verified and clear token
        await pb.collection('users').update(userId, {
          verified: true,
          verification_token: '' // Clear it after use
        }, { $autoCancel: false });
        return true;
      } else {
        throw new Error("Invalid or expired verification token.");
      }
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  };

  const requestEmailVerification = async (email) => {
    try {
      // Using PocketBase's built-in request verification as a fallback/standard method
      // Note: Our custom hook handles the initial signup email, this is for resending
      await pb.collection('users').requestVerification(email, { $autoCancel: false });
      return true;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    verifyEmail,
    requestEmailVerification,
    isAuthenticated: !!currentUser,
    isVerified: currentUser?.verified || false,
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_15px_rgba(0,212,255,0.5)]"></div>
          <p className="text-[#00d4ff] font-mono tracking-widest animate-pulse">INITIALIZING...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};