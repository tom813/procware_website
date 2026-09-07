import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Globe } from "lucide-react";
import { TOOLS_SEO } from "../utils/seoUtils";

interface ToolLanguageSwitcherProps {
  toolKey: string;
  currentLang: "de" | "en";
}

export const ToolLanguageSwitcher: React.FC<ToolLanguageSwitcherProps> = ({
  toolKey,
  currentLang,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const config = TOOLS_SEO[toolKey];

  const handleSwitch = (lang: "de" | "en") => {
    if (lang === currentLang) return;
    if (config) {
      navigate(config[lang].canonicalPath);
    } else {
      if (lang === "en" && !location.pathname.startsWith("/en")) {
        navigate(`/en${location.pathname}`);
      } else if (lang === "de" && location.pathname.startsWith("/en")) {
        navigate(location.pathname.replace(/^\/en/, "") || "/");
      }
    }
  };

  return (
    <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-slate-100/90 border border-slate-200 text-[11px] font-semibold">
      <Globe className="w-3 h-3 text-slate-400 ml-1" />
      <button
        type="button"
        onClick={() => handleSwitch("de")}
        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
          currentLang === "de"
            ? "bg-white text-slate-950 shadow-xs font-bold"
            : "text-slate-500 hover:text-slate-900"
        }`}
        title="Deutsch"
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => handleSwitch("en")}
        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
          currentLang === "en"
            ? "bg-white text-slate-950 shadow-xs font-bold"
            : "text-slate-500 hover:text-slate-900"
        }`}
        title="English"
      >
        EN
      </button>
    </div>
  );
};
