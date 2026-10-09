import React from 'react';
import { useApp } from '../../context/AppContext';
import { TRANSIT_LINES } from '../../constants/mumbaiData';
import { Train, Bus, Users, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const TransitComfortModule: React.FC = () => {
  const { currentScenarioId } = useApp();
  const isTrainDisrupted = currentScenarioId === 'train_disruption';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Train className="w-5 h-5 text-[#2166F3]" />
            <h2 className="text-base sm:text-lg font-bold text-[#0B1F3A]">
              Transit Comfort & Crowding Pulse
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Suburban railway, metro lines & BEST bus real-time headways and seating prediction
          </p>
        </div>
        <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
          GTFS-RT Feeds Active
        </span>
      </div>

      {/* Transit Lines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TRANSIT_LINES.map((line) => {
          const isSuspended = isTrainDisrupted && line.lineId === 'western_railway';
          const status = isSuspended ? 'Heavy Delay' : line.status;
          const delay = isSuspended ? 38 : line.delayMinutes;
          const crowd = isSuspended ? 'Crush Load' : line.crowdLevel;

          return (
            <div 
              key={line.lineId}
              className={`p-4 rounded-2xl border transition-all ${
                isSuspended 
                  ? 'bg-red-50/50 border-red-200' 
                  : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {line.operator}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {line.type}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0B1F3A] mt-0.5">
                    {line.name}
                  </h4>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                  status === 'Normal'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {status}
                </span>
              </div>

              {/* Delay and Crowd metrics */}
              <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Average Headway Delay</span>
                  </div>
                  <div className="font-extrabold text-[#0B1F3A] mt-0.5 font-mono-numbers">
                    +{delay} mins
                  </div>
                </div>

                <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>Carriage Crowd</span>
                  </div>
                  <div className="font-extrabold text-[#0B1F3A] mt-0.5">
                    {crowd}
                  </div>
                </div>
              </div>

              {/* Seating & Boarding Comfort Tip */}
              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-[#2166F3] shrink-0 mt-0.5" />
                <span>
                  <b>Comfort recommendation: </b>
                  {isSuspended 
                    ? 'Switch to Metro Line 1 & 3 Aqua. Railway corridor operating with 35m delay.' 
                    : line.comfortTip}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
