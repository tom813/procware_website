import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LeadRecord } from "../types/intelligence";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  redirectUrl: string | null;
  setRedirectUrl: (url: string | null) => void;
  googleClientId: string;
  saveGoogleClientId: (id: string) => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password?: string,
    shopUrl?: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (options?: {
    clientIdOverride?: string;
    manualEmail?: string;
    manualName?: string;
  }) => Promise<{ success: boolean; error?: string; requiresClientId?: boolean }>;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register", redirectUrl?: string) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "procware_ecom_suite_user_v1";
const GOOGLE_CLIENT_ID_KEY = "procware_google_client_id";
export const DEFAULT_GOOGLE_CLIENT_ID = "946561379004-bse6a225v7l549fudfnfjsvqefuuqgav.apps.googleusercontent.com";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("register");
  const [redirectUrl, setRedirectUrl] = useState<string | null>("/suite");
  const [googleClientId, setGoogleClientIdState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(GOOGLE_CLIENT_ID_KEY);
      if (stored && stored.trim().length > 0 && stored.includes("apps.googleusercontent.com")) {
        return stored.trim();
      }
      return (
        (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
        DEFAULT_GOOGLE_CLIENT_ID
      );
    }
    return DEFAULT_GOOGLE_CLIENT_ID;
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load stored user session", e);
    } finally {
      setIsLoading(false);
    }

    // Always ensure current valid Google Client ID from server or fallback
    fetch("/api/auth/config")
      .then((res) => res.json())
      .then((data) => {
        const id = data?.googleClientId || DEFAULT_GOOGLE_CLIENT_ID;
        if (id) {
          setGoogleClientIdState(id);
          if (typeof window !== "undefined") {
            localStorage.setItem(GOOGLE_CLIENT_ID_KEY, id);
          }
        }
      })
      .catch(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem(GOOGLE_CLIENT_ID_KEY, DEFAULT_GOOGLE_CLIENT_ID);
        }
      });
  }, []);

  const saveGoogleClientId = (id: string) => {
    const trimmed = id.trim();
    if (typeof window !== "undefined") {
      localStorage.setItem(GOOGLE_CLIENT_ID_KEY, trimmed);
    }
    setGoogleClientIdState(trimmed);
  };

  // Post lead to backend API
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

  // Sync user profile with Cloud SQL
  const syncUserToCloudSql = async (userData: User) => {
    try {
      await fetch("/api/sync/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatarUrl,
        }),
      });
    } catch (err) {
      console.warn("Cloud SQL user sync error:", err);
    }
  };

  const register = async (name: string, email: string, _password?: string, shopUrl?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      return { success: false, error: "Bitte gib eine gültige E-Mail-Adresse ein." };
    }
    if (!trimmedName) {
      return { success: false, error: "Bitte gib deinen Namen ein." };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      shopUrl: shopUrl?.trim() || undefined,
      provider: "email",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthModalOpen(false);

    // Track lead and synchronize user with Cloud SQL
    syncLeadToBackend({
      name: trimmedName,
      email: trimmedEmail,
      shopUrl: shopUrl?.trim(),
      source: "Ecom Suite Register Modal",
    });
    syncUserToCloudSql(newUser);

    return { success: true };
  };

  const login = async (email: string, _password?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      return { success: false, error: "Bitte gib eine gültige E-Mail-Adresse ein." };
    }

    // Try finding existing name if previously registered or fallback
    let existingName = trimmedEmail.split("@")[0];
    existingName = existingName.charAt(0).toUpperCase() + existingName.slice(1);

    const loggedUser: User = {
      id: `usr-${Date.now()}`,
      name: existingName,
      email: trimmedEmail,
      provider: "email",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);
    setIsAuthModalOpen(false);

    // Also update lead record and synchronize with Cloud SQL
    syncLeadToBackend({
      name: existingName,
      email: trimmedEmail,
      source: "Ecom Suite Login",
    });
    syncUserToCloudSql(loggedUser);

    return { success: true };
  };

  const loginWithGoogle = async (options?: {
    clientIdOverride?: string;
    manualEmail?: string;
    manualName?: string;
  }): Promise<{ success: boolean; error?: string; requiresClientId?: boolean }> => {
    try {
      // Option A: Manual email testing/bypass if user explicitly enters their own email
      if (options?.manualEmail) {
        const trimmedEmail = options.manualEmail.trim().toLowerCase();
        if (!trimmedEmail || !trimmedEmail.includes("@")) {
          return { success: false, error: "Bitte gib eine gültige Google-E-Mail-Adresse ein." };
        }
        let name = options.manualName?.trim();
        if (!name) {
          const localPart = trimmedEmail.split("@")[0];
          name = localPart
            .replace(/[._-]/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
        }

        const googleUser: User = {
          id: `google-${Date.now()}`,
          name: name || "Google User",
          email: trimmedEmail,
          provider: "google",
          avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s96-c",
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(googleUser));
        setUser(googleUser);
        setIsAuthModalOpen(false);

        syncLeadToBackend({
          name: googleUser.name,
          email: googleUser.email,
          source: "Google 1-Click Login",
        });

        return { success: true };
      }

      // Option B: Real Google Identity Services (GSI) OAuth 2.0 popup
      const effectiveClientId =
        options?.clientIdOverride?.trim() ||
        googleClientId ||
        (typeof window !== "undefined"
          ? localStorage.getItem(GOOGLE_CLIENT_ID_KEY) || ""
          : "") ||
        DEFAULT_GOOGLE_CLIENT_ID;

      if (!effectiveClientId) {
        return {
          success: false,
          requiresClientId: true,
          error: "Keine Google Client-ID konfiguriert. Bitte hinterlege deine Google Cloud OAuth Client-ID.",
        };
      }

      // Ensure google gsi script is ready
      if (typeof window !== "undefined" && !(window as any).google?.accounts?.oauth2) {
        let attempts = 0;
        while (attempts < 8 && !(window as any).google?.accounts?.oauth2) {
          await new Promise((r) => setTimeout(r, 250));
          attempts++;
        }
      }

      if (typeof window === "undefined" || !(window as any).google?.accounts?.oauth2) {
        return {
          success: false,
          error: "Google Identity Services SDK konnte nicht geladen werden. Bitte deaktiviere eventuelle Skript-Blocker und lade die Seite neu.",
        };
      }

      return new Promise<{ success: boolean; error?: string; requiresClientId?: boolean }>((resolve) => {
        try {
          const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: effectiveClientId,
            scope: "email profile openid",
            prompt: "select_account",
            callback: async (tokenResp: any) => {
              if (tokenResp.error) {
                if (tokenResp.error === "popup_closed_by_user") {
                  resolve({ success: false, error: "Google-Anmeldung wurde vom Benutzer abgebrochen." });
                } else {
                  resolve({
                    success: false,
                    error: `Google OAuth Fehler: ${tokenResp.error_description || tokenResp.error}`,
                  });
                }
                return;
              }

              try {
                const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                  headers: { Authorization: `Bearer ${tokenResp.access_token}` },
                });

                if (!userinfoRes.ok) {
                  resolve({
                    success: false,
                    error: "Konnte Profildaten von Google nicht abrufen.",
                  });
                  return;
                }

                const profile = await userinfoRes.json();
                const googleUser: User = {
                  id: `google-${profile.sub || Date.now()}`,
                  name: profile.name || profile.given_name || profile.email.split("@")[0],
                  email: (profile.email || "").toLowerCase(),
                  provider: "google",
                  avatarUrl: profile.picture || "https://lh3.googleusercontent.com/a/default-user=s96-c",
                  createdAt: new Date().toISOString(),
                };

                localStorage.setItem(STORAGE_KEY, JSON.stringify(googleUser));
                setUser(googleUser);
                setIsAuthModalOpen(false);

                syncLeadToBackend({
                  name: googleUser.name,
                  email: googleUser.email,
                  source: "Google OAuth 2.0 1-Click Login",
                });
                syncUserToCloudSql(googleUser);

                resolve({ success: true });
              } catch (fetchErr: any) {
                resolve({
                  success: false,
                  error: "Fehler beim Laden des Google Profils: " + (fetchErr?.message || "Unbekannter Fehler"),
                });
              }
            },
            error_callback: (err: any) => {
              resolve({
                success: false,
                error: err?.message || "Google-Authentifizierung fehlgeschlagen.",
              });
            },
          });

          tokenClient.requestAccessToken({ prompt: "select_account" });
        } catch (clientErr: any) {
          resolve({
            success: false,
            error: "Google Sign-In Initialisierung fehlgeschlagen: " + (clientErr?.message || "Unbekannter Fehler"),
          });
        }
      });
    } catch (err: any) {
      return { success: false, error: err.message || "Fehler beim Google-Login." };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
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
        isLoading,
        redirectUrl,
        setRedirectUrl,
        googleClientId,
        saveGoogleClientId,
        login,
        register,
        loginWithGoogle,
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
