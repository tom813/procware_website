import React, { useState, useMemo } from "react";

export interface ScheduledDelivery {
  id: string;
  day: number;
  units: number;
  label?: string;
}

interface InventoryForecastChartProps {
  currentStock: number;
  forecastPoints: {
    day: number;
    stock: number;
    salesToday: number;
    deliveryToday: number;
  }[];
  safetyStock: number;
  reorderPoint: number;
  totalDays: number;
  lang?: "de" | "en";
}

export const InventorySawtoothChart: React.FC<InventoryForecastChartProps> = ({
  currentStock,
  forecastPoints,
  safetyStock,
  reorderPoint,
  totalDays,
  lang = "de",
}) => {
  const isEn = lang === "en";
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Dimensions & Padding
  const width = 800;
  const height = 280;
  const padding = { top: 25, right: 35, bottom: 40, left: 55 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Find max stock value to scale the Y axis with comfortable headroom
  const maxStock = useMemo(() => {
    let max = Math.max(currentStock, reorderPoint, safetyStock, 100);
    forecastPoints.forEach((pt) => {
      if (pt.stock > max) max = pt.stock;
    });
    return Math.ceil(max * 1.15);
  }, [currentStock, reorderPoint, safetyStock, forecastPoints]);

  const getX = (day: number) => padding.left + (day / totalDays) * innerWidth;
  const getY = (units: number) => padding.top + innerHeight - (Math.max(0, units) / maxStock) * innerHeight;

  // Single clean SVG curve starting at Tag 0 = currentStock!
  const pathD = useMemo(() => {
    if (!forecastPoints || forecastPoints.length === 0) return "";
    let d = `M ${getX(0)} ${getY(currentStock)}`;

    for (let i = 0; i < forecastPoints.length; i++) {
      const pt = forecastPoints[i];
      // If there's a delivery on this day, the line steps up vertically before continuing
      if (pt.deliveryToday > 0) {
        const stockBeforeDelivery = pt.stock - pt.deliveryToday;
        d += ` L ${getX(pt.day)} ${getY(stockBeforeDelivery)}`;
        d += ` L ${getX(pt.day)} ${getY(pt.stock)}`;
      } else {
        d += ` L ${getX(pt.day)} ${getY(pt.stock)}`;
      }
    }
    return d;
  }, [forecastPoints, currentStock, totalDays, maxStock]);

  // Gradient area under the single curve
  const areaD = useMemo(() => {
    if (!forecastPoints || forecastPoints.length === 0) return "";
    let d = `M ${getX(0)} ${getY(currentStock)}`;

    for (let i = 0; i < forecastPoints.length; i++) {
      const pt = forecastPoints[i];
      if (pt.deliveryToday > 0) {
        const stockBeforeDelivery = pt.stock - pt.deliveryToday;
        d += ` L ${getX(pt.day)} ${getY(stockBeforeDelivery)}`;
        d += ` L ${getX(pt.day)} ${getY(pt.stock)}`;
      } else {
        d += ` L ${getX(pt.day)} ${getY(pt.stock)}`;
      }
    }
    // Close to bottom baseline
    const lastPt = forecastPoints[forecastPoints.length - 1];
    d += ` L ${getX(lastPt.day)} ${getY(0)}`;
    d += ` L ${getX(0)} ${getY(0)} Z`;
    return d;
  }, [forecastPoints, currentStock, totalDays, maxStock]);

  const zeroY = getY(0);

  // Find first stockout day if any
  const stockoutPoint = useMemo(() => {
    return forecastPoints.find((pt) => pt.stock <= 0);
  }, [forecastPoints]);

  // Deliveries on the timeline for markers
  const deliveryMarkers = useMemo(() => {
    return forecastPoints.filter((pt) => pt.deliveryToday > 0);
  }, [forecastPoints]);

  // Active hover point
  const activePt = hoveredIndex !== null && forecastPoints[hoveredIndex] ? forecastPoints[hoveredIndex] : null;

  return (
    <div className="w-full bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
      {/* Header with Title & Clear Minimal Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h3 className="text-sm font-bold text-slate-950">
              {isEn ? "Projected Stock Development (Single Curve)" : "Prognostizierte Bestandsentwicklung (Reine Verlaufskurve)"}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEn
              ? `Starts today at exactly ${currentStock.toLocaleString()} units and projects depletion & incoming deliveries.`
              : `Startet heute bei exakt ${currentStock.toLocaleString()} Stück und projiziert Abverkauf & geplante Wareneingänge.`}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-blue-600 rounded-full" />
            <span className="text-slate-700">{isEn ? "Forecasted Stock" : "Lagerbestand"}</span>
          </div>
          {safetyStock > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 border-b-2 border-dashed border-amber-500" />
              <span className="text-amber-700 font-medium">
                {isEn ? "Safety Stock" : "Sicherheitsbestand"} ({safetyStock.toLocaleString()} Stk.)
              </span>
            </div>
          )}
          {deliveryMarkers.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-600">{isEn ? "Incoming Delivery" : "Wareneingang"}</span>
            </div>
          )}
          {stockoutPoint && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-red-600 font-bold">{isEn ? "Stockout Risk" : "Out-of-Stock"}</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas - Clutter Free, NO Distracting Horizontal Grid Lines */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[580px] select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            {/* Smooth clean gradient under the stock curve */}
            <linearGradient id="stockCurveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Area Fill under the Single Stock Curve */}
          <path d={areaD} fill="url(#stockCurveGradient)" />

          {/* Bottom Baseline (Day 0 to End, 0 units) */}
          <line
            x1={padding.left}
            y1={zeroY}
            x2={width - padding.right}
            y2={zeroY}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />

          {/* Safety Stock Horizontal Line (Editable Threshold) */}
          {safetyStock > 0 && (
            <g>
              <line
                x1={padding.left}
                y1={getY(safetyStock)}
                x2={width - padding.right}
                y2={getY(safetyStock)}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.85"
              />
              {/* Badge on right side */}
              <rect
                x={width - padding.right - 148}
                y={getY(safetyStock) - 10}
                width="144"
                height="19"
                rx="4"
                fill="#fffbeb"
                stroke="#f59e0b"
                strokeWidth="1"
              />
              <text
                x={width - padding.right - 76}
                y={getY(safetyStock) + 3.5}
                fill="#b45309"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                {isEn ? "Safety Stock: " : "Sicherheitsbestand: "}{safetyStock.toLocaleString()} Stk.
              </text>
            </g>
          )}

          {/* The Single Inventory Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Day 0 Start Point Marker (Today's Actual Stock) */}
          <g transform={`translate(${getX(0)}, ${getY(currentStock)})`}>
            <circle r="4.5" fill="#1d4ed8" />
            <circle r="8" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />
            <rect
              x="8"
              y="-12"
              width="95"
              height="20"
              rx="4"
              fill="#1e293b"
              opacity="0.92"
            />
            <text x="14" y="2" fill="#ffffff" fontSize="9.5" fontWeight="bold">
              {isEn ? "Today: " : "Heute: "}{currentStock.toLocaleString()} Stk.
            </text>
          </g>

          {/* Delivery Arrival Markers on Curve */}
          {deliveryMarkers.map((m) => (
            <g key={m.day} transform={`translate(${getX(m.day)}, ${getY(m.stock)})`}>
              <line
                x1="0"
                y1={zeroY - getY(m.stock)}
                x2="0"
                y2="0"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              <circle r="4.5" fill="#10b981" />
              <rect
                x="-36"
                y="-24"
                width="72"
                height="18"
                rx="4"
                fill="#d1fae5"
                stroke="#10b981"
                strokeWidth="1"
              />
              <text x="0" y="-12" fill="#065f46" fontSize="9" fontWeight="bold" textAnchor="middle">
                +{m.deliveryToday.toLocaleString()}
              </text>
            </g>
          ))}

          {/* Stockout Point Marker if Stock Reaches 0 */}
          {stockoutPoint && (
            <g transform={`translate(${getX(stockoutPoint.day)}, ${zeroY})`}>
              <circle r="5" fill="#ef4444" />
              <circle r="9" fill="none" stroke="#f87171" strokeWidth="1.5" />
              <rect
                x="-40"
                y="-28"
                width="80"
                height="18"
                rx="4"
                fill="#fee2e2"
                stroke="#ef4444"
                strokeWidth="1"
              />
              <text x="0" y="-16" fill="#991b1b" fontSize="9" fontWeight="bold" textAnchor="middle">
                ⚠️ {isEn ? `Day ${stockoutPoint.day} (0)` : `Tag ${stockoutPoint.day} (0 Stk.)`}
              </text>
            </g>
          )}

          {/* X Axis Time Marks (e.g. Month 1 = 30d, Month 2 = 60d, Month 3 = 90d...) */}
          {Array.from({ length: Math.floor(totalDays / 30) + 1 }, (_, i) => i * 30).map((d) => (
            <g key={d} transform={`translate(${getX(d)}, ${zeroY})`}>
              <line x1="0" y1="0" x2="0" y2="5" stroke="#94a3b8" />
              <text x="0" y="18" fill="#64748b" fontSize="10" fontWeight="600" textAnchor="middle">
                {d === 0 ? (isEn ? "Today" : "Heute") : `${d}d (${isEn ? "Mo." : "M."} ${Math.round(d / 30)})`}
              </text>
            </g>
          ))}

          {/* Y Axis Labels (Only Min 0 and Max, zero clutter) */}
          <text
            x={padding.left - 8}
            y={getY(maxStock) + 8}
            fill="#64748b"
            fontSize="9"
            fontWeight="bold"
            textAnchor="end"
          >
            {maxStock.toLocaleString()}
          </text>
          <text
            x={padding.left - 8}
            y={zeroY + 3}
            fill="#64748b"
            fontSize="9"
            fontWeight="bold"
            textAnchor="end"
          >
            0
          </text>

          {/* Interactive Mouse Hover Rectangles */}
          {forecastPoints.map((pt, idx) => (
            <rect
              key={pt.day}
              x={getX(pt.day) - innerWidth / totalDays / 2}
              y={padding.top}
              width={innerWidth / totalDays}
              height={innerHeight}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoveredIndex(idx)}
            />
          ))}

          {/* Hover Pin & Detail Tooltip */}
          {activePt && (
            <g transform={`translate(${getX(activePt.day)}, ${getY(activePt.stock)})`}>
              {/* Vertical guideline */}
              <line
                x1="0"
                y1={zeroY - getY(activePt.stock)}
                x2="0"
                y2={padding.top - getY(activePt.stock)}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.4"
              />
              <circle r="4" fill="#0f172a" />
              <g transform="translate(0, -38)">
                <rect
                  x="-60"
                  y="0"
                  width="120"
                  height="32"
                  rx="6"
                  fill="#0f172a"
                  opacity="0.95"
                />
                <text x="0" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {isEn ? `Day ${activePt.day}:` : `Tag ${activePt.day}:`} {activePt.stock.toLocaleString()} Stk.
                </text>
                <text x="0" y="26" fill="#94a3b8" fontSize="8.5" textAnchor="middle">
                  - {activePt.salesToday} Stk./Tag {activePt.deliveryToday > 0 ? `| +${activePt.deliveryToday} Liefer.` : ""}
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Dynamic Summary Strip */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="font-semibold text-slate-900">{isEn ? "Horizon:" : "Zeithorizont:"}</span>
          <span>{totalDays} {isEn ? "Days" : "Tage"} ({Math.round(totalDays / 30)} {isEn ? "Months" : "Monate"})</span>
        </div>

        <div className="flex items-center gap-3">
          {stockoutPoint ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-bold border border-red-200">
              ⚠️ {isEn ? `Stockout on Day ${stockoutPoint.day}` : `Bestand erschöpft an Tag ${stockoutPoint.day}`}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              ✓ {isEn ? "No stockout predicted" : "Kein Out-of-Stock im Zeitraum"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
