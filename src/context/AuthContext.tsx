import React, { createContext, useContext, useState } from "react";
import { authClient, useSession } from "../lib/authClient";

interface SessionUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  redirectUrl: string | null;
  setRedirectUrl: (url: string | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    shopUrl?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register", redirectUrl?: string) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isPending } = useSession();
  // better-auth's generic React client can't fully infer the session shape
  // without importing the server config (which would pull server code into
  // the client bundle), so we assert the well-known base session/user shape here.
  const session = data as { user: SessionUser } | null;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("register");
  const [redirectUrl, setRedirectUrl] = useState<string | null>("/suite");

  const user: SessionUser | null = session?.user
    ? { id: session.user.id, name: session.user.name, email: session.user.email }
    : null;

  // Track the registration/booking lead in the CRM (independent of the account itself)
  const syncLeadToBackend = async (data: { name: string; email: string; shopUrl?: string; source: string }) => {
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn("Backend lead sync error:", err);
    }
  };

  const register = async (name: string, email: string, password: string, shopUrl?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      return { success: false, error: "Bitte gib eine gültige E-Mail-Adresse ein." };
    }
    if (!trimmedName) {
      return { success: false, error: "Bitte gib deinen Namen ein." };
    }
    if (!password || password.length < 12) {
      return { success: false, error: "Das Passwort muss mindestens 12 Zeichen lang sein." };
    }

    const { error } = await authClient.signUp.email({
      email: trimmedEmail,
      password,
      name: trimmedName,
    });

    if (error) {
      const message =
        error.status === 422 || /already exists|exist/i.test(error.message || "")
          ? "Für diese E-Mail-Adresse besteht bereits ein Konto. Bitte melde dich an."
          : error.message || "Registrierung fehlgeschlagen.";
      return { success: false, error: message };
    }

    setIsAuthModalOpen(false);

    syncLeadToBackend({
      name: trimmedName,
      email: trimmedEmail,
      shopUrl: shopUrl?.trim(),
      source: "Ecom Suite Register Modal",
    });

    return { success: true };
  };

  const login = async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      return { success: false, error: "Bitte gib eine gültige E-Mail-Adresse ein." };
    }
    if (!password) {
      return { success: false, error: "Bitte gib dein Passwort ein." };
    }

    const { error } = await authClient.signIn.email({
      email: trimmedEmail,
      password,
    });

    if (error) {
      // AUTH-05: never reveal whether the account exists.
      return { success: false, error: "E-Mail-Adresse oder Passwort ist falsch." };
    }

    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    void authClient.signOut({});
  };

  const openAuthModal = (mode: "login" | "register" = "register", targetRedirectUrl?: string) => {
    setAuthModalMode(mode);
    if (targetRedirectUrl) {
      setRedirectUrl(targetRedirectUrl);
    } else if (typeof window !== "undefined" && window.location.pathname) {
      setRedirectUrl(window.location.pathname);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: isPending,
        redirectUrl,
        setRedirectUrl,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
