import React, { useState } from 'react';
import { RoutePlan, TransportMode } from '../../types';
import { 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  Smile, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Play, 
  Info,
  Layers,
  Footprints,
  Train,
  Bus,
  Car,
  AlertCircle
} from 'lucide-react';

interface RouteCardProps {
  route: RoutePlan;
  isSelected: boolean;
  onSelect: () => void;
  onStartTrip: () => void;
  onCompare: () => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  isSelected,
  onSelect,
  onStartTrip,
  onCompare,
}) => {
  const [isWhyOpen, setIsWhyOpen] = useState(false);

  const renderModeIcon = (mode: TransportMode, idx: number) => {
    switch (mode) {
      case 'walk':
        return <span key={idx} title="Walk"><Footprints className="w-4 h-4 text-emerald-600" /></span>;
      case 'metro':
        return <span key={idx} title="Metro"><Train className="w-4 h-4 text-blue-600" /></span>;
      case 'train':
        return <span key={idx} title="Local Train"><Train className="w-4 h-4 text-red-600" /></span>;
      case 'bus':
        return <span key={idx} title="BEST Bus"><Bus className="w-4 h-4 text-amber-600" /></span>;
      case 'auto':
      case 'cab':
      case 'car':
        return <span key={idx} title="Road Vehicle"><Car className="w-4 h-4 text-slate-700" /></span>;
      default:
        return <span key={idx} title="Transit"><Footprints className="w-4 h-4 text-slate-500" /></span>;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-2xl bg-white border transition-all cursor-pointer overflow-hidden p-4 sm:p-5 ${
        isSelected
          ? 'border-[#2166F3] ring-2 ring-[#2166F3]/20 shadow-md'
          : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* Top Tag & Recommendation (Zero-pill discipline: unboxed clean text or subtle highlight banner) */}
      {route.recommended && (
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2166F3] tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#2166F3]" />
            <span>{route.recommendationTag || 'BEST FOR YOU'}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium font-mono-numbers">
            Score: {route.compositeScore}
          </span>
        </div>
      )}

      {/* Title & Modes Sequence */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] leading-snug">
            {route.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {route.summary}
          </p>
        </div>

        {/* Multimodal Flow Icons */}
        <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
          {route.modes.map((mode, idx) => (
            <React.Fragment key={idx}>
              {renderModeIcon(mode, idx)}
              {idx < route.modes.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-400" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Core Decision Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100">
        
        {/* Travel Time & Uncertainty P50 / P90 */}
        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Travel Time</span>
          </div>
          <div className="text-base font-extrabold text-[#0B1F3A] mt-0.5 font-mono-numbers">
            {route.p50Minutes} min
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Worst-case: <span className="font-semibold text-slate-700 font-mono-numbers">{route.p90Minutes}m</span>
          </div>
        </div>

        {/* Cost & Breakdown */}
        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
            <span>Total Cost</span>
          </div>
          <div className="text-base font-extrabold text-[#0B1F3A] mt-0.5 font-mono-numbers">
            ₹{route.costInr}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Transit: <span className="font-semibold text-slate-700 font-mono-numbers">₹{route.costBreakdown.transitFare}</span>
          </div>
        </div>

        {/* Safety Score */}
        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Safety Score</span>
          </div>
          <div className="text-base font-extrabold text-emerald-700 mt-0.5 font-mono-numbers">
            {route.safetyScore}/100
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Flood: <span className="font-semibold text-slate-700">{route.floodExposure}</span>
          </div>
        </div>

        {/* Confidence & Crowd */}
        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Confidence</span>
          </div>
          <div className="text-base font-extrabold text-[#2166F3] mt-0.5 font-mono-numbers">
            {route.confidencePercent}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Crowd: <span className="font-semibold text-slate-700">{route.crowdLevel}</span>
          </div>
        </div>

      </div>

      {/* Uncertainty Visualization Bar */}
      <div className="mt-3.5 pt-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span>Arrival Uncertainty Model</span>
          <span className="font-mono-numbers font-medium text-slate-700">
            Buffer: +{route.p90Minutes - route.p50Minutes} min
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
          <div 
            style={{ width: `${(route.p50Minutes / route.p90Minutes) * 100}%` }}
            className="bg-[#2166F3] h-full"
            title={`Typical P50: ${route.p50Minutes}m`}
          />
          <div 
            style={{ width: `${((route.p90Minutes - route.p50Minutes) / route.p90Minutes) * 100}%` }}
            className="bg-amber-300 h-full"
            title={`Worst-case P90 buffer: +${route.p90Minutes - route.p50Minutes}m`}
          />
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsWhyOpen(!isWhyOpen);
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0B1F3A] transition-colors py-2 px-1 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-[#2166F3]" />
          <span>Why this route?</span>
          {isWhyOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCompare();
            }}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer min-h-[36px]"
          >
            Compare
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStartTrip();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2166F3] hover:bg-[#1b55cc] rounded-xl shadow-xs transition-colors cursor-pointer min-h-[36px]"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Start Route</span>
          </button>
        </div>
      </div>

      {/* Expandable "Why This Route?" Section */}
      {isWhyOpen && (
        <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/80 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-4 sm:p-5 rounded-b-2xl">
          <div className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-2">
            Why Mumbai Copilot Recommended This:
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {route.whyReasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#16A878] font-bold mt-0.5">✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>

          {/* How We Decided Weights Bar */}
          <div className="mt-3.5 pt-3 border-t border-slate-200/70">
            <div className="text-[11px] font-semibold text-slate-700 mb-1.5">
              Decision Feature Weighting:
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-600">
              <span>Time: <b>{route.weightContributions.time}%</b></span>
              <span>Cost: <b>{route.weightContributions.cost}%</b></span>
              <span>Safety: <b>{route.weightContributions.safety}%</b></span>
              <span>Comfort: <b>{route.weightContributions.comfort}%</b></span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
