import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, ShieldCheck, Clock, IndianRupee, Users, Sparkles, AlertCircle } from 'lucide-react';

export const WhyThisRouteSheet: React.FC = () => {
  const { isWhyRouteOpen, setIsWhyRouteOpen, selectedRoute, targetTime } = useApp();

  if (!isWhyRouteOpen || !selectedRoute) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="glass-sheet sm:glass-card w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-5 sm:p-6 space-y-5 animate-slide-up">
        
        {/* Mobile Drag handle */}
        <div className="drag-handle sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2166F3] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B1F3A]">Why This Route?</h3>
              <p className="text-xs text-slate-500">Transparent AI decision engine breakdown</p>
            </div>
          </div>
          <button
            onClick={() => setIsWhyRouteOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Title Strip */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#0B1F3A]">{selectedRoute.title}</div>
            <div className="text-[11px] text-slate-500">{selectedRoute.summary}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-[#2166F3] font-mono-numbers">
              {selectedRoute.confidencePercent}% Confidence
            </div>
            <div className="text-[10px] text-slate-500">P90 upper estimate</div>
          </div>
        </div>

        {/* Decision Factors Checkpoints */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recommended Because:
          </div>
          <div className="space-y-2">
            {selectedRoute.whyReasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-700 shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                  ✓
                </div>
                <span className="leading-snug">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How We Decided Feature Weights Bar */}
        <div className="space-y-2.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>How We Decided (Feature Attribution)</span>
            <span className="text-[11px] font-normal text-slate-500">SHAP values</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 block">Time</span>
              <span className="font-extrabold text-[#0B1F3A] font-mono-numbers">
                {selectedRoute.weightContributions.time}%
              </span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 block">Cost</span>
              <span className="font-extrabold text-[#0B1F3A] font-mono-numbers">
                {selectedRoute.weightContributions.cost}%
              </span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 block">Safety</span>
              <span className="font-extrabold text-emerald-700 font-mono-numbers">
                {selectedRoute.weightContributions.safety}%
              </span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 block">Comfort</span>
              <span className="font-extrabold text-amber-600 font-mono-numbers">
                {selectedRoute.weightContributions.comfort}%
              </span>
            </div>
          </div>
        </div>

        {/* Uncertainty Range Model */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Statistical Travel Time Model</span>
            <span className="text-[#2166F3] font-mono-numbers">
              +{selectedRoute.p90Minutes - selectedRoute.p50Minutes}m buffer
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(selectedRoute.p50Minutes / selectedRoute.p90Minutes) * 100}%` }}
              className="bg-[#2166F3] h-full"
            />
            <div
              style={{ width: `${((selectedRoute.p90Minutes - selectedRoute.p50Minutes) / selectedRoute.p90Minutes) * 100}%` }}
              className="bg-amber-300 h-full"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Typical (50th percentile): <b>{selectedRoute.p50Minutes} min</b></span>
            <span>Upper limit (90th percentile): <b>{selectedRoute.p90Minutes} min</b></span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsWhyRouteOpen(false)}
          className="w-full h-12 rounded-xl bg-[#0B1F3A] text-white font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-[#16305a] transition-colors"
        >
          Got it
        </button>

      </div>
    </div>
  );
};
