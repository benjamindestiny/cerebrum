import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const user = session.user;
        setCurrentUser(user);
        
        // Get user profile
        try {
          const profile = await authService.getProfile(user.id);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const user = session.user;
          setCurrentUser(user);
          
          try {
            const profile = await authService.getProfile(user.id);
            setUserProfile(profile);
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, name) => {
    const data = await authService.signUp(email, password, name);
    return data;
  };

  const signIn = async (email, password) => {
    const data = await authService.signIn(email, password);
    return data;
  };

  const signInWithGoogle = async () => {
    const data = await authService.signInWithGoogle();
    return data;
  };

  const signOut = async () => {
    await authService.signOut();
  };

  const updateProfile = async (updates) => {
    if (!currentUser) return;
    const profile = await authService.updateProfile(currentUser.id, updates);
    setUserProfile(profile);
    return profile;
  };

  const updateStats = async (statsData) => {
    if (!currentUser) return;
    const profile = await authService.updateStats(currentUser.id, statsData);
    setUserProfile(profile);
    return profile;
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    updateStats
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
