"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

  useEffect(() => {
    // Check for existing user session on load
    const storedUser = localStorage.getItem("ksp_user");
    if (storedUser) {
      // Use setTimeout to avoid synchronous state update during render
      setTimeout(() => {
        setUser(JSON.parse(storedUser));
      }, 0);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on email
    let mockUser: User;
    if (email === "admin@kspmds.com") {
      mockUser = {
        id: "1",
        name: "Administrator",
        email: "admin@kspmds.com",
        role: "admin",
        permissions: ["*"] // All permissions
      };
    } else if (email === "manager@kspmds.com") {
      mockUser = {
        id: "2",
        name: "Branch Manager",
        email: "manager@kspmds.com",
        role: "manager",
        permissions: [
          "members:read",
          "members:create",
          "members:update",
          "loans:read",
          "loans:create",
          "loans:update",
          "savings:read",
          "savings:create",
          "savings:update",
          "transactions:read",
          "reports:read"
        ]
      };
    } else {
      mockUser = {
        id: "3",
        name: "Anggota Biasa",
        email: "member@kspmds.com",
        role: "member",
        permissions: [
          "members:read:own",
          "savings:read:own",
          "savings:create:own",
          "savings:update:own",
          "transactions:read:own",
          "loans:read:own",
          "loans:create:own"
        ]
      };
    }
    
    setUser(mockUser);
    localStorage.setItem("ksp_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ksp_user");
  };

  const isAuthenticated = !!user;

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes("*")) return true;
    return user.permissions.includes(permission);
  };

  const isRole = (role: "admin" | "manager" | "member"): boolean => {
    return user?.role === role;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    hasPermission,
    isRole
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