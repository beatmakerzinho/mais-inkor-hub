import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminSession = () => {
    const adminSessionStr = localStorage.getItem('adminSession');
    if (adminSessionStr) {
      try {
        const adminSession = JSON.parse(adminSessionStr);
        if (adminSession.expires_at > Date.now()) {
          setUser(adminSession.user as User);
          setIsAdmin(true);
          return true;
        } else {
          localStorage.removeItem('adminSession');
        }
      } catch (e) {
        console.error("Error parsing admin session:", e);
        localStorage.removeItem('adminSession');
      }
    }
    return false;
  };

  const logout = async () => {
    if (isAdmin) {
      localStorage.removeItem('adminSession');
      setUser(null);
      setIsAdmin(false);
      return;
    }

    await supabase.auth.signOut();
  };

  useEffect(() => {
    if (checkAdminSession()) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      const { user } = await getCurrentUser();
      setUser(user);
      setLoading(false);
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setIsAdmin(false);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
