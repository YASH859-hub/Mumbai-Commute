import React from 'react';
import { useApp } from '../../context/AppContext';
import { TimeType } from '../../types';
import { Clock, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export const LeaveByCard: React.FC = () => {
  const { 
    timeType, 
    setTimeType, 
    targetTime, 
    setTargetTime, 
    leaveByRecommendation,
    selectedRoute 
  } = useApp();

  const bufferMinutes = selectedRoute 
    ? selectedRoute.p90Minutes - selectedRoute.p50Minutes 
    : 8;

  const confidence = selectedRoute 
    ? selectedRoute.confidencePercent 
    : 90;

  return (
    <div className="bg-gradient-to-br from-[#0B1F3A] to-[#153463] text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      
      {/* Time Mode Segmented Control */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-white/10 rounded-xl">
          <button
            onClick={() => setTimeType('arrive_by')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              timeType === 'arrive_by' 
                ? 'bg-white text-[#0B1F3A] shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Arrive by
          </button>
          <button
            onClick={() => setTimeType('leave_now')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              timeType === 'leave_now' 
                ? 'bg-white text-[#0B1F3A] shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Leave now
          </button>
          <button
            onClick={() => setTimeType('leave_at')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              timeType === 'leave_at' 
                ? 'bg-white text-[#0B1F3A] shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Leave at
          </button>
        </div>

        {/* Target Time Input */}
        {timeType !== 'leave_now' && (
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
            <Clock className="w-3.5 h-3.5 text-blue-300" />
            <input
              type="time"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              className="bg-transparent text-white text-xs font-bold outline-none font-mono-numbers cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Main Leave-By Recommendation Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-blue-300 uppercase">
            Recommended Departure
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono-numbers text-white">
              {leaveByRecommendation}
            </span>
            <span className="text-xs text-blue-200 font-medium">
              for arrival by {targetTime}
            </span>
          </div>
        </div>

        {/* Confidence Badge & Buffer */}
        <div className="flex items-center gap-3 bg-white/10 px-3.5 py-2.5 rounded-xl border border-white/10 shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-emerald-300 flex items-center gap-1 justify-end">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{confidence}% Confidence</span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono-numbers">
              +{bufferMinutes}m uncertainty buffer
            </div>
          </div>
        </div>
      </div>

      {/* Clear Plain-Language Uncertainty Explanation */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-xs text-blue-100/90 leading-relaxed">
        <p>
          "Depart at <b>{leaveByRecommendation}</b> to guarantee a <b>{confidence}% statistical chance</b> of reaching destination by <b>{targetTime}</b>, accounting for Mumbai monsoon variance and peak corridor bottleneck risk."
        </p>
      </div>

    </div>
  );
};
