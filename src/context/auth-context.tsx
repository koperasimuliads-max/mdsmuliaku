"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "member";
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  isRole: (role: "admin" | "manager" | "member") => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const name = email.split("@")[0];
    setUser({
      id: crypto.randomUUID(),
      name: name || "Pengguna",
      email,
      role: "member",
      permissions: ["*"],
    });
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  const hasPermission = (_permission: string): boolean => {
    return true;
  };

  const isRole = (_role: "admin" | "manager" | "member"): boolean => {
    return user?.role === _role;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    hasPermission,
    isRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
