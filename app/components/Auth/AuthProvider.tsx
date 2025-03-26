"use client";

// src/components/Auth/AuthProvider.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import supabase from '@/lib/supabaseClient';

type Role = 'admin' | 'adherent' | null;

interface AuthContextType {
  user: any;
  role: Role;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("SESSION INITIALE :", session);
      const currentUser = session?.user;
  
      setUser(currentUser);
  
      if (currentUser) {
        const metadata = currentUser.user_metadata;
        if (metadata?.administrateur) {
          setRole("admin");
        } else if (metadata?.statut_inscription === "inscrit") {
          setRole("adherent");
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }
  
      setIsLoading(false); // ✅ ici OK
    };
  
    getSession();
  
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      console.log("SESSION ÉVÉNEMENT :", session);

  
      if (currentUser) {
        const metadata = currentUser.user_metadata;
        if (metadata?.administrateur) {
          setRole("admin");
        } else if (metadata?.statut_inscription === "inscrit") {
          setRole("adherent");
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }
  
      setIsLoading(false); // ✅ c’est ça qu’il manquait
    });
    console.log("Rôle détecté :", role);

  
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour accéder facilement au contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
