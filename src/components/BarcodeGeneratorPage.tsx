import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import JsBarcode from "jsbarcode";
import { applyToolSeo } from "../utils/seoUtils";
import { ToolLanguageSwitcher } from "./ToolLanguageSwitcher";
import {
  Barcode,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  X,
  HelpCircle,
  FileCode,
  ArrowRight,
  ChevronDown,
  Info,
  CheckCircle2,
  Calendar,
  Layers,
  ShoppingBag,
  ExternalLink,
  Search,
} from "lucide-react";
import { Badge } from "./ui/badge";

type BarcodeFormatKey = "CODE128" | "EAN13" | "EAN8" | "UPC" | "CODE39" | "ITF14" | "MSI" | "pharmacode" | "codabar";

interface FormatConfig {
  id: BarcodeFormatKey;
  label: string;
  pillLabel: string;
  category: "standard" | "more";
  description: string;
  inputHint: string;
  defaultVal: string;
  sampleVal: string;
  validator: (val: string) => { isValid: boolean; message?: string; sanitized: string };
}

// Modulo 10 Checksum for EAN-13
function calculateEan13Checksum(first12: string): number {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(first12[i] || "0", 10);
    sum += i % 2 === 0 ? digit * 1 : digit * 3;
  }
  const mod = sum % 10;
  return mod === 0 ? 0 : 10 - mod;
}

// Modulo 10 Checksum for EAN-8
function calculateEan8Checksum(first7: string): number {
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const digit = parseInt(first7[i] || "0", 10);
    sum += i % 2 === 0 ? digit * 3 : digit * 1;
  }
  const mod = sum % 10;
  return mod === 0 ? 0 : 10 - mod;
}

// Modulo 10 Checksum for UPC-A (12 digits total)
function calculateUpcAChecksum(first11: string): number {
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(first11[i] || "0", 10);
    sum += i % 2 === 0 ? digit * 3 : digit * 1;
  }
  const mod = sum % 10;
  return mod === 0 ? 0 : 10 - mod;
}

const FORMAT_CONFIGS: Record<BarcodeFormatKey, FormatConfig> = {
  CODE128: {
    id: "CODE128",
    label: "Code 128 (Standard)",
    pillLabel: "Code 128 (Standard)",
    category: "standard",
    description: "Universeller Barcode für alle Buchstaben, Zahlen und Sonderzeichen (ASCII).",
    inputHint: "Alle 128 ASCII-Zeichen (Buchstaben A-Z, a-z, 0-9, Sonderzeichen)",
    defaultVal: "BARCODE-2026",
    sampleVal: "PROCWARE-SKU-99",
    validator: (val) => ({ isValid: val.trim().length > 0, sanitized: val.trim() }),
  },
  EAN13: {
    id: "EAN13",
    label: "EAN-13 / GTIN",
    pillLabel: "EAN-13 / GTIN",
    category: "standard",
    description: "Internationaler 13-stelliger Standard für den Einzelhandel, Supermärkte & Google Shopping.",
    inputHint: "12 oder 13 Ziffern (13. Prüfziffer wird automatisch berechnet)",
    defaultVal: "426012345678",
    sampleVal: "426055891234",
    validator: (val) => {
      const digits = val.replace(/\D/g, "");
      if (digits.length === 12) {
        const check = calculateEan13Checksum(digits);
        return { isValid: true, sanitized: `${digits}${check}` };
      }
      if (digits.length === 13) {
        return { isValid: true, sanitized: digits };
      }
      return {
        isValid: false,
        message: "EAN-13 benötigt genau 12 oder 13 Ziffern.",
        sanitized: digits.slice(0, 13),
      };
    },
  },
  EAN8: {
    id: "EAN8",
    label: "EAN-8",
    pillLabel: "EAN-8",
    category: "standard",
    description: "Kompakter 8-stelliger Barcode für kleine Produktverpackungen mit wenig Platz.",
    inputHint: "7 oder 8 Ziffern (8. Prüfziffer wird automatisch ergänzt)",
    defaultVal: "4012345",
    sampleVal: "9031101",
    validator: (val) => {
      const digits = val.replace(/\D/g, "");
      if (digits.length === 7) {
        const check = calculateEan8Checksum(digits);
        return { isValid: true, sanitized: `${digits}${check}` };
      }
      if (digits.length === 8) {
        return { isValid: true, sanitized: digits };
      }
      return {
        isValid: false,
        message: "EAN-8 benötigt genau 7 oder 8 Ziffern.",
        sanitized: digits.slice(0, 8),
      };
    },
  },
  UPC: {
    id: "UPC",
    label: "UPC-A",
    pillLabel: "UPC-A",
    category: "standard",
    description: "12-stelliger US-Standard für Verkäufe in Nordamerika und US-Marktplätze.",
    inputHint: "11 oder 12 Ziffern (Prüfziffer wird automatisch ergänzt)",
    defaultVal: "01234567890",
    sampleVal: "03600029145",
    validator: (val) => {
      const digits = val.replace(/\D/g, "");
      if (digits.length === 11) {
        const check = calculateUpcAChecksum(digits);
        return { isValid: true, sanitized: `${digits}${check}` };
      }
      if (digits.length === 12) {
        return { isValid: true, sanitized: digits };
      }
      return {
        isValid: false,
        message: "UPC-A benötigt 11 oder 12 Ziffern.",
        sanitized: digits.slice(0, 12),
      };
    },
  },
  CODE39: {
    id: "CODE39",
    label: "Code 39",
    pillLabel: "Code 39",
    category: "more",
    description: "Klassischer Industrie- und Logistik-Barcode für Großbuchstaben und Ziffern.",
    inputHint: "Großbuchstaben (A-Z), Ziffern (0-9) und Symbole (- . $ / + %)",
    defaultVal: "ITEM-2026",
    sampleVal: "LOT-8492-DE",
    validator: (val) => ({
      isValid: /^[0-9A-Z\-\.\ \$\/\+\%]+$/i.test(val) && val.length > 0,
      sanitized: val.toUpperCase(),
      message: "Code 39 erlaubt nur A-Z, 0-9 und - . $ / + %",
    }),
  },
  ITF14: {
    id: "ITF14",
    label: "ITF-14 (Masterkarton)",
    pillLabel: "ITF-14",
    category: "more",
    description: "14-stelliger Barcode für Umverpackungen und Masterkartons im Frachtverkehr.",
    inputHint: "Genau 14 Ziffern für Versand- und Transportkartons",
    defaultVal: "14260123456786",
    sampleVal: "10012345678902",
    validator: (val) => {
      const digits = val.replace(/\D/g, "");
      return {
        isValid: digits.length === 14,
        message: "ITF-14 benötigt exakt 14 Ziffern.",
        sanitized: digits.slice(0, 14),
      };
    },
  },
  MSI: {
    id: "MSI",
    label: "MSI / Plessey",
    pillLabel: "MSI",
    category: "more",
    description: "Numerischer Barcode für Lagerregale, Bestandszählung und Inventur.",
    inputHint: "Nur Ziffern (0-9)",
    defaultVal: "12345678",
    sampleVal: "987654321",
    validator: (val) => {
      const digits = val.replace(/\D/g, "");
      return { isValid: digits.length > 0, sanitized: digits };
    },
  },
  pharmacode: {
    id: "pharmacode",
    label: "Pharmacode",
    pillLabel: "Pharmacode",
    category: "more",
    description: "Pharmazeutischer Barcode zur Verpackungskontrolle in der Medizinindustrie.",
    inputHint: "Ganzzahl zwischen 3 und 131070",
    defaultVal: "12345",
    sampleVal: "94820",
    validator: (val) => {
      const num = parseInt(val.replace(/\D/g, ""), 10);
      const isValid = !isNaN(num) && num >= 3 && num <= 131070;
      return {
        isValid,
        message: "Pharmacode muss eine Zahl zwischen 3 und 131070 sein.",
        sanitized: isNaN(num) ? "1234" : num.toString(),
      };
    },
  },
  codabar: {
    id: "codabar",
    label: "Codabar",
    pillLabel: "Codabar",
    category: "more",
    description: "Spezialcode für Blutbanken, Bibliotheken und Fotolabore.",
    inputHint: "Ziffern mit Start-/Stoppzeichen A, B, C oder D",
    defaultVal: "A12345678B",
    sampleVal: "A987654B",
    validator: (val) => ({ isValid: val.length > 0, sanitized: val.toUpperCase() }),
  },
};

interface BarcodeGeneratorPageProps {
  onOpenBooking: () => void;
  lang?: "de" | "en";
}

export const BarcodeGeneratorPage: React.FC<BarcodeGeneratorPageProps> = ({ onOpenBooking, lang: propLang }) => {
  const location = useLocation();
  const currentLang: "de" | "en" = propLang || (location.pathname.startsWith("/en") ? "en" : "de");

  useEffect(() => {
    applyToolSeo("barcode", currentLang);
    window.scrollTo(0, 0);
  }, [currentLang]);

  // Preselected format: CODE128 as standard per screenshot
  const [format, setFormat] = useState<BarcodeFormatKey>("CODE128");
  const [inputValue, setInputValue] = useState<string>("BARCODE-2026");
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentConfig = FORMAT_CONFIGS[format];

  // Set default value when switching format
  const handleSelectFormat = (fmt: BarcodeFormatKey) => {
    setFormat(fmt);
    setInputValue(FORMAT_CONFIGS[fmt].defaultVal);
    setMoreDropdownOpen(false);
  };

  // Generate example
  const handleGenerateSample = () => {
    if (format === "EAN13") {
      let rand = "4260";
      for (let i = 0; i < 8; i++) {
        rand += Math.floor(Math.random() * 10);
      }
      const check = calculateEan13Checksum(rand);
      setInputValue(`${rand}${check}`);
    } else if (format === "EAN8") {
      let rand = "40";
      for (let i = 0; i < 5; i++) {
        rand += Math.floor(Math.random() * 10);
      }
      const check = calculateEan8Checksum(rand);
      setInputValue(`${rand}${check}`);
    } else if (format === "UPC") {
      let rand = "0";
      for (let i = 0; i < 10; i++) {
        rand += Math.floor(Math.random() * 10);
      }
      const check = calculateUpcAChecksum(rand);
      setInputValue(`${rand}${check}`);
    } else {
      setInputValue(currentConfig.sampleVal);
    }
  };

  // Re-render barcode whenever format or input changes
  useEffect(() => {
    if (!svgRef.current) return;

    const validation = currentConfig.validator(inputValue);
    const valueToRender = validation.sanitized;

    if (!valueToRender || (!validation.isValid && validation.message)) {
      setErrorMsg(validation.message || "Ungültige Eingabe für dieses Format.");
      return;
    }

    try {
      JsBarcode(svgRef.current, valueToRender, {
        format: format === "EAN13" ? "EAN13" : format === "EAN8" ? "EAN8" : format === "UPC" ? "UPC" : format,
        lineColor: "#000000",
        width: 2.2,
        height: 90,
        displayValue: true,
        font: "monospace",
        fontSize: 15,
        fontOptions: "bold",
        margin: 15,
        background: "#ffffff",
        valid: (valid) => {
          if (!valid) {
            setErrorMsg(`Ungültiger Inhalt für ${currentConfig.label}.`);
          } else {
            setErrorMsg(null);
          }
        },
      });
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(`Fehler: ${err?.message || "Formatprüfung fehlgeschlagen"}`);
    }
  }, [format, inputValue, currentConfig]);

  // Copy Barcode value to clipboard
  const handleCopy = () => {
    const val = currentConfig.validator(inputValue).sanitized || inputValue;
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download SVG
  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const svgXml = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgXml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const sanitizedVal = currentConfig.validator(inputValue).sanitized || "barcode";
    link.download = `barcode-${format.toLowerCase()}-${sanitizedVal}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download high-res PNG (300 DPI canvas rendering)
  const handleDownloadPng = () => {
    if (!svgRef.current) return;

    const svgXml = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgXml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Scale by 2.5x for sharp printing
      const scale = 2.5;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        const sanitizedVal = currentConfig.validator(inputValue).sanitized || "barcode";
        link.download = `barcode-${format.toLowerCase()}-${sanitizedVal}.png`;
        link.href = pngUrl;
        link.click();
      }
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  // Print Barcode Label
  const handlePrint = () => {
    if (!svgRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const svgXml = new XMLSerializer().serializeToString(svgRef.current);
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Barcode Drucken - ${inputValue}</title>
          <style>
            body {
              font-family: sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .label-card {
              border: 1px dashed #94a3b8;
              padding: 24px 32px;
              text-align: center;
              border-radius: 8px;
            }
            @media print {
              .label-card { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="label-card">
            ${svgXml}
            <div style="margin-top: 10px; font-size: 11px; color: #64748b;">
              Format: ${currentConfig.label} | Generiert mit Procware
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const characterCount = useMemo(() => {
    return currentConfig.validator(inputValue).sanitized.length;
  }, [inputValue, currentConfig]);

  return (
    <div className="bg-white text-slate-900 min-h-screen pt-24 sm:pt-28 pb-20">
      {/* Main Generator Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-16">
        {/* Top utility row with Breadcrumb on left and discreet Language Switcher in top right */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <Link
            to="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <span>←</span>
            <span>{currentLang === "en" ? "All E-Com Tools" : "Alle Tools"}</span>
          </Link>
          <div className="flex items-center gap-2">
            <ToolLanguageSwitcher toolKey="barcode" currentLang={currentLang} />
          </div>
        </div>

        {/* Title and Subheading */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            {currentLang === "en" ? "Free Barcode & GTIN Generator" : "Barcode Generator"}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {currentLang === "en"
              ? "Enter your code value. The barcode renders in real-time and is immediately ready for high-resolution SVG or PNG download."
              : "Trage einfach deinen Wert ein. Der Barcode wird in Echtzeit erzeugt und steht sofort als SVG oder PNG zum Download bereit."}
          </p>
        </div>

        {/* 1. Barcode-Typ Wählen (Selection Bar) */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Barcode-Typ wählen:
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {currentConfig.description}
            </span>
          </div>

          {/* Format Tabs / Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {(["CODE128", "EAN13", "EAN8", "UPC"] as BarcodeFormatKey[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleSelectFormat(fmt)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  format === fmt
                    ? "bg-slate-950 text-white shadow-md shadow-slate-950/20"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {FORMAT_CONFIGS[fmt].pillLabel}
              </button>
            ))}

            {/* Dropdown for More Formats */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                  FORMAT_CONFIGS[format].category === "more"
                    ? "bg-slate-950 text-white border-slate-950"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {FORMAT_CONFIGS[format].category === "more"
                    ? FORMAT_CONFIGS[format].pillLabel
                    : "Weitere Formate"}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1.5">
                    Weitere 1D-Barcodes
                  </div>
                  {(["CODE39", "ITF14", "MSI", "pharmacode", "codabar"] as BarcodeFormatKey[]).map(
                    (fmt) => (
                      <button
                        key={fmt}
                        onClick={() => handleSelectFormat(fmt)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                          format === fmt
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{FORMAT_CONFIGS[fmt].label}</span>
                        {format === fmt && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Barcode Input Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Barcode-Inhalt / Wert
            </label>
            <span className="text-xs text-slate-400 font-normal">
              {currentConfig.inputHint}
            </span>
          </div>

          <div className="relative flex items-center mt-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Barcode-Wert eingeben..."
              className="w-full pl-5 pr-28 py-3.5 bg-white border border-slate-300 focus:border-slate-900 rounded-2xl text-base sm:text-lg font-mono font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
            />

            <div className="absolute right-3 flex items-center gap-1.5">
              {inputValue && (
                <button
                  onClick={() => setInputValue("")}
                  title="Eingabe leeren"
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleGenerateSample}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Beispiel
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Schnell-Vorlagen (Quick Templates per screenshot) */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-bold text-slate-700">Schnell-Vorlagen:</span>
            <button
              onClick={() => handleSelectFormat("CODE128")}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              Code 128 (Standard)
            </button>
            <button
              onClick={() => handleSelectFormat("EAN13")}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              EAN-13 (Supermarkt)
            </button>
            <button
              onClick={() => handleSelectFormat("EAN8")}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              EAN-8 (Klein)
            </button>
            <button
              onClick={() => handleSelectFormat("UPC")}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              UPC-A (USA)
            </button>
          </div>
        </div>

        {/* 3. Barcode Live Preview Card & Actions (Matching Screenshot) */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col items-center">
          {/* White Card holding the rendered SVG */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm max-w-lg w-full flex flex-col items-center justify-center min-h-[160px]">
            {errorMsg ? (
              <div className="text-center py-6 text-slate-400 text-xs font-medium">
                Bitte gültige Zeichen für das ausgewählte Format eingeben.
              </div>
            ) : (
              <svg ref={svgRef} className="max-w-full h-auto" />
            )}
          </div>

          {/* Action Bar (Left Badges + Right Buttons) */}
          <div className="mt-8 w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {/* Left Badges */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentConfig.label}</span>
              </span>
              <span className="px-2.5 py-1.5 rounded-xl bg-slate-200/70 text-xs font-mono font-bold text-slate-700">
                {characterCount} Zeichen
              </span>
            </div>

            {/* Right Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!!errorMsg}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Kopiert!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Kopieren</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                disabled={!!errorMsg}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Drucken</span>
              </button>

              <button
                onClick={handleDownloadPng}
                disabled={!!errorMsg}
                className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>PNG Download</span>
              </button>

              <button
                onClick={handleDownloadSvg}
                disabled={!!errorMsg}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>SVG Vektor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hidden Canvas for High-DPI conversions */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Procware Sourcing Barcode Marketing Callout */}
        <div className="mt-10 rounded-3xl bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentLang === "en" ? "Procware Automatic Barcodes" : "Automatische Barcodes bei Procware"}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {currentLang === "en"
                ? "Sourcing with Procware? Barcodes are provided automatically."
                : "Wer bei Procware sourct, bekommt Barcodes automatisch zur Verfügung gestellt."}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {currentLang === "en"
                ? "Here you generate the graphical barcode image for individual use. When you source products directly with Procware, you don't need to manually create or paste barcodes: we automatically provide verified GS1-ready barcodes, SKU tags, and packaging labels directly during factory production."
                : "Auf dieser Seite generierst du das Bild für deinen Barcode. Wer bei Procware sourct, muss keine Barcodes manuell erstellen oder aufkleben: Wir stellen dir automatisch die passenden Barcodes zur Verfügung und bringen sie direkt ab Fabrik auf deinen Produkten und Verpackungen an."}
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="https://calendly.com/team-procware/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-colors shadow-md text-center cursor-pointer"
            >
              <span>{currentLang === "en" ? "Book Free Strategy Call" : "Erstgespräch buchen"}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* RICH SEO KNOWLEDGE CONTENT: KEYWORDS BARCODE, GTIN, EAN */}
      {/* ========================================================= */}
      <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">
          {/* SEO Heading Intro */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
              Leitfaden & Ratgeber
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Alles über Barcode, EAN und GTIN Generator
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Ein Barcode (Strichcode) ist die optische Darstellung von Produkt- und Artikeldaten,
              die von automatischen Laserscannern und Kamerasystemen fehlerfrei erfasst werden kann.
              Für E-Commerce Händler auf Shopify, Amazon und Google Shopping sind gültige Barcodes
              eine Grundvoraussetzung für Marktplatz-Freischaltungen und reibungslose Logistik.
            </p>
          </div>

          {/* Section 1: Difference Barcode vs EAN vs GTIN */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              Was ist der Unterschied zwischen Barcode, EAN und GTIN?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Die Begriffe <strong>Barcode</strong>, <strong>EAN</strong> und <strong>GTIN</strong> werden
              oft synonym verwendet, beschreiben jedoch unterschiedliche Ebenen der Artikelidentifikation:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-bold text-sm text-slate-950 block">GTIN (Datenstruktur)</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Global Trade Item Number</strong> ist die offizielle Ziffernfolge (8, 12, 13
                  oder 14 Stellen) der GS1-Organisation zur weltweiten eineindeutigen Identifikation von Handelswaren.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-bold text-sm text-slate-950 block">EAN-13 (Europäischer Code)</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Die <strong>European Article Number</strong> ist der optische Strichcode der 13-stelligen
                  GTIN. Er wird auf Verpackungen im europäischen Einzelhandel gedruckt.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-bold text-sm text-slate-950 block">Barcode / Code 128</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Der Oberbegriff für alle optischen Strichcodes. <strong>Code 128</strong> erlaubt Buchstaben,
                  Zahlen und Sonderzeichen und wird primär in Logistik und Lagerhaltung eingesetzt.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Format Comparison Table */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              Welches Barcode-Format ist das richtige für mein Produkt?
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Format</th>
                    <th className="pb-3 px-4">Länge</th>
                    <th className="pb-3 px-4">Einsatzbereich</th>
                    <th className="pb-3 pl-4">Typische Nutzung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  <tr>
                    <td className="py-3.5 pr-4 font-bold text-slate-900">EAN-13 / GTIN-13</td>
                    <td className="py-3.5 px-4 font-mono">13 Ziffern</td>
                    <td className="py-3.5 px-4">Europa, weltweit (außer USA)</td>
                    <td className="py-3.5 pl-4">Supermarkt, Shopify, Google Shopping</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 font-bold text-slate-900">UPC-A / GTIN-12</td>
                    <td className="py-3.5 px-4 font-mono">12 Ziffern</td>
                    <td className="py-3.5 px-4">USA & Kanada</td>
                    <td className="py-3.5 pl-4">Nordamerikanischer Einzelhandel & Amazon.com</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 font-bold text-slate-900">Code 128</td>
                    <td className="py-3.5 px-4 font-mono">Variabel (ASCII)</td>
                    <td className="py-3.5 px-4">Weltweit Industrie & Logistik</td>
                    <td className="py-3.5 pl-4">Lageretiketten, SKUs, Sendungsverfolgung</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 font-bold text-slate-900">EAN-8 / GTIN-8</td>
                    <td className="py-3.5 px-4 font-mono">8 Ziffern</td>
                    <td className="py-3.5 px-4">Kleine Produkte</td>
                    <td className="py-3.5 pl-4">Kosmetik, Kaugummis, Schreibwaren</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 font-bold text-slate-900">ITF-14 / GTIN-14</td>
                    <td className="py-3.5 px-4 font-mono">14 Ziffern</td>
                    <td className="py-3.5 px-4">Transport & Großhandel</td>
                    <td className="py-3.5 pl-4">Masterkartons, Paletten, Frachtsendungen</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Modulo 10 Checksum Calculation Guide */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              Wie wird die Prüfziffer einer EAN-13 berechnet?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Die 13. Stelle einer EAN ist eine mathematische Prüfziffer (Modulo 10), um
              Tippfehler oder Lesefehler von Barcodescannern sofort zu erkennen.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2 text-slate-800">
              <div className="font-bold text-slate-950 font-sans text-sm mb-1">
                Berechnungsbeispiel nach GS1-Standard:
              </div>
              <div>1. Ziffern an ungeraden Positionen (1, 3, 5, ...) mit <strong>1</strong> multiplizieren.</div>
              <div>2. Ziffern an geraden Positionen (2, 4, 6, ...) mit <strong>3</strong> multiplizieren.</div>
              <div>3. Alle Einzelergebnisse addieren.</div>
              <div>4. Differenz zur nächsten vollen Zehnerzahl ergibt die Prüfziffer.</div>
            </div>
            <p className="text-xs text-slate-500">
              Unser GTIN & EAN Generator berechnet diese Prüfziffer bei Eingabe von 12 Ziffern automatisch für dich!
            </p>
          </div>

          {/* Section 4: Shopify & Google Shopping Integration */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              Warum benötigt dein Shopify Store echte GTINs?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Google Shopping, Meta Ads und Marktplätze gleichen Produktdaten im Hintergrund mit der
              internationalen GS1-Datenbank ab. Produkte mit gültiger GTIN erzielen nachweislich:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bis zu 40% mehr Impressionen im Google Merchant Center</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Geringere Klickpreise (CPC) bei Google Performance Max Ads</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Keine Disqualifizierung oder Ablehnung wegen fehlender Kennung</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automatischer Scan im 100% deutschen Fulfillment-Center und Retourenlager</span>
              </li>
            </ul>
          </div>

          {/* Section 5: FAQ Schema (Frequently Asked Questions) */}
          <div id="faq" className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              Häufig gestellte Fragen (FAQ) zum Barcode & GTIN Generator
            </h3>

            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h4 className="font-bold text-sm text-slate-900 mb-2">
                  Ist dieser Barcode Generator wirklich kostenlos?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ja, der Procware Barcode Generator ist zu 100% kostenfrei, werbefrei und ohne Registrierung
                  nutzbar. Du kannst beliebig viele Barcodes generieren und als hochauflösendes PNG oder SVG herunterladen.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h4 className="font-bold text-sm text-slate-900 mb-2">
                  Kann ich die Barcodes für kommerzielle Produkte verwenden?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Die technischen Bilddateien (SVG und PNG) sind frei nutzbar. Für den Verkauf im stationären
                  Handel (z.B. Supermarkt) oder auf Plattformen wie Amazon benötigst du jedoch offizielle,
                  einzigartige GTIN-Nummern, die du bei GS1 (z.B. GS1 Germany) lizensieren kannst.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h4 className="font-bold text-sm text-slate-900 mb-2">
                  In welchem Format (SVG oder PNG) sollte ich meinen Barcode drucken?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Für den professionellen Druck auf Produktverpackungen oder Etiketten empfehlen wir das
                  Vektorformat <strong>SVG</strong>. Da SVG verlustfrei skaliert, bleibt der Barcode in jeder
                  Größe messerscharf und kann von jedem Laserscanner problemlos gelesen werden.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h4 className="font-bold text-sm text-slate-900 mb-2">
                  Wie hilft mir Procware beim Sourcing und der Etikettierung?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Als E-Commerce Zwischenhändler und Fulfillment-Plattform organisiert Procware die
                  Herstellung deiner Produkte, Qualitätskontrollen im Werk und druckt deine Barcodes, EAN-Etiketten
                  sowie individuelle Hangtags direkt vor Ort auf die Ware.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Banner: Fulfillment & Labeling Support */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
        <div className="rounded-3xl bg-slate-950 text-white p-8 sm:p-12 shadow-2xl border border-slate-900 text-center relative overflow-hidden">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-blue-300">
              <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
              <span>Full-Service für Shopify Brands</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Barcode-Druck direkt im Werk vor dem Versand
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Möchtest du, dass deine Produkte bereits in der Fabrik mit deinen individuellen
              EAN-Strichcodes, Hangtags und Markenverpackungen versehen werden?
            </p>

            <div className="pt-2">
              <a
                href="https://calendly.com/team-procware/new-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm font-bold px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/25 transition-all cursor-pointer group"
              >
                <Calendar className="w-4 h-4" />
                <span>Kostenloses Erstgespräch buchen</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
