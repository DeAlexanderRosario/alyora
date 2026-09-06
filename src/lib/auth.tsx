'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from './api';

type AuthUser = { id: string; email: string } | null;

type AuthContextType = {
  user: AuthUser;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, refreshUser: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    if (!api.isLoggedIn()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user: u } = await api.getMe();
      setUser(u);
    } catch {
      api.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return <AuthContext.Provider value={{ user, loading, refreshUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
