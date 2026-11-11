import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { AuthContext } from './authStore';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for login, logout, and session changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Register a new user.
  const register = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  // Sign in with email and password.
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  // Sign out and clear the local session.
  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
