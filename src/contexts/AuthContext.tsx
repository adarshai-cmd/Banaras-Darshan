"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { AuthModal } from "@/components/modals/AuthModal";

export interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  role: string;
  avatar: string | null;
  bio?: string | null;
  reputation?: number;
  badge?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalMode: "login" | "signup";
  openAuthModal: (mode?: "login" | "signup") => void;
  closeAuthModal: () => void;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");
  const pathname = usePathname();

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Prompt unauthenticated visitors when landing on the home page
  useEffect(() => {
    if (isLoading) return;

    if (!user && pathname === "/") {
      const hasDismissed = sessionStorage.getItem("bd_auth_prompt_dismissed");
      if (!hasDismissed) {
        const timer = setTimeout(() => {
          setAuthModalMode("login");
          setAuthModalOpen(true);
        }, 900);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, user, pathname]);

  const openAuthModal = useCallback((mode: "login" | "signup" = "login") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("bd_auth_prompt_dismissed", "true");
    }
  }, []);

  const login = useCallback((newUser: AuthUser) => {
    setUser(newUser);
    setAuthModalOpen(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("bd_auth_prompt_dismissed");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        onSuccess={(u) => {
          login(u);
        }}
      />
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
