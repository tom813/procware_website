import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

export interface CompetitorItem {
  id: string;
  name: string;
  domain: string;
  productUrls: string[];
  notes?: string;
  createdAt: string;
}

interface CompetitorContextType {
  competitors: CompetitorItem[];
  addCompetitor: (domainOrUrl: string, name?: string, initialProductUrl?: string) => CompetitorItem;
  removeCompetitor: (id: string) => void;
  addProductUrlToCompetitor: (id: string, url: string) => void;
  removeProductUrlFromCompetitor: (id: string, url: string) => void;
}

const STORAGE_KEY_PREFIX = "procware_ecom_suite_competitors_u_";

const INITIAL_COMPETITORS: CompetitorItem[] = [
  {
    id: "comp-snocks",
    name: "SNOCKS",
    domain: "snocks.com",
    productUrls: ["https://snocks.com/products/sneaker-socken-schwarz"],
    notes: "Direct-to-Consumer Basic Apparel",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: "comp-gymshark",
    name: "Gymshark",
    domain: "gymshark.com",
    productUrls: ["https://gymshark.com/products/vital-seamless-2-0-leggings"],
    notes: "Fitness Apparel & Athleisure",
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: "comp-lumina",
    name: "Lumina Sunset",
    domain: "lumina-glow.myshopify.com",
    productUrls: ["https://lumina-glow.myshopify.com/products/sunset-lamp-pro"],
    notes: "Trending Ambient Lighting",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const CompetitorContext = createContext<CompetitorContextType | undefined>(undefined);

export const CompetitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userKey = user?.email?.trim().toLowerCase() || user?.id?.trim() || "guest";
  const userStorageKey = `${STORAGE_KEY_PREFIX}${encodeURIComponent(userKey)}`;
  const lastLoadedKeyRef = useRef<string>(userStorageKey);

  const [competitors, setCompetitors] = useState<CompetitorItem[]>(() => {
    if (typeof window === "undefined") return INITIAL_COMPETITORS;
    try {
      const stored = localStorage.getItem(userStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load stored competitors", e);
    }
    return INITIAL_COMPETITORS;
  });

  // Whenever user changes, load that user's specific competitor list
  useEffect(() => {
    lastLoadedKeyRef.current = userStorageKey;
    try {
      const stored = localStorage.getItem(userStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCompetitors(parsed);
        } else {
          setCompetitors(INITIAL_COMPETITORS);
        }
      } else {
        setCompetitors(INITIAL_COMPETITORS);
      }
    } catch (e) {
      setCompetitors(INITIAL_COMPETITORS);
    }

    // Cloud SQL remote sync for authenticated users
    if (userKey && userKey !== "guest") {
      fetch(`/api/sync/competitors?userId=${encodeURIComponent(userKey)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.competitors) && data.competitors.length > 0) {
            const formatted: CompetitorItem[] = data.competitors.map((c: any) => ({
              id: c.competitorId || `comp-${c.domain}`,
              name: c.name,
              domain: c.domain,
              productUrls: Array.isArray(c.productUrls) ? c.productUrls : [],
              notes: c.notes || undefined,
              createdAt: c.createdAt || new Date().toISOString(),
            }));
            setCompetitors(formatted);
            localStorage.setItem(userStorageKey, JSON.stringify(formatted));
          }
        })
        .catch((err) => console.warn("Failed to fetch remote competitors from Cloud SQL", err));
    }
  }, [userStorageKey, userKey]);

  // Save changes specifically for current user
  useEffect(() => {
    if (lastLoadedKeyRef.current === userStorageKey) {
      try {
        localStorage.setItem(userStorageKey, JSON.stringify(competitors));
      } catch (e) {
        console.warn("Could not save competitors to localStorage", e);
      }

      // Sync with Cloud SQL
      if (userKey && userKey !== "guest") {
        competitors.forEach((c) => {
          fetch("/api/sync/competitors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userKey, competitor: c }),
          }).catch((err) => console.warn("Cloud SQL competitor sync error", err));
        });
      }
    }
  }, [competitors, userStorageKey, userKey]);

  const cleanDomain = (raw: string): string => {
    return raw
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "")
      .replace(/^www\./i, "");
  };

  const addCompetitor = (domainOrUrl: string, customName?: string, initialProductUrl?: string): CompetitorItem => {
    const domain = cleanDomain(domainOrUrl);
    const existing = competitors.find((c) => c.domain === domain);
    if (existing) {
      if (initialProductUrl && !existing.productUrls.includes(initialProductUrl)) {
        addProductUrlToCompetitor(existing.id, initialProductUrl);
      }
      return existing;
    }

    const defaultName = customName?.trim() || domain.split(".")[0].toUpperCase();
    const newItem: CompetitorItem = {
      id: `comp-${Date.now()}`,
      name: defaultName,
      domain,
      productUrls: initialProductUrl ? [initialProductUrl.trim()] : [],
      createdAt: new Date().toISOString(),
    };

    setCompetitors((prev) => [newItem, ...prev]);
    return newItem;
  };

  const removeCompetitor = (id: string) => {
    const compToDelete = competitors.find((c) => c.id === id);
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
    if (userKey && userKey !== "guest" && compToDelete?.domain) {
      fetch("/api/sync/competitors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userKey, domain: compToDelete.domain }),
      }).catch((err) => console.warn("Cloud SQL competitor delete error", err));
    }
  };

  const addProductUrlToCompetitor = (id: string, url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setCompetitors((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const urls = c.productUrls || [];
          if (!urls.includes(trimmed)) {
            return { ...c, productUrls: [...urls, trimmed] };
          }
        }
        return c;
      })
    );
  };

  const removeProductUrlFromCompetitor = (id: string, url: string) => {
    setCompetitors((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, productUrls: (c.productUrls || []).filter((u) => u !== url) };
        }
        return c;
      })
    );
  };

  return (
    <CompetitorContext.Provider
      value={{
        competitors,
        addCompetitor,
        removeCompetitor,
        addProductUrlToCompetitor,
        removeProductUrlFromCompetitor,
      }}
    >
      {children}
    </CompetitorContext.Provider>
  );
};

export const useCompetitors = () => {
  const context = useContext(CompetitorContext);
  if (!context) {
    throw new Error("useCompetitors must be used within a CompetitorProvider");
  }
  return context;
};
