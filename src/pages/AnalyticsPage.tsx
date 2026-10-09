import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Waves, 
  MapPin, 
  AlertTriangle, 
  Car, 
  Train, 
  Building2, 
  Layers,
  Activity
} from 'lucide-react';
import { MumbaiInteractiveMap } from '../components/map/MumbaiInteractiveMap';
import { WATERLOGGING_HOTSPOTS } from '../constants/mumbaiData';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#2166F3]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A]">
              Mumbai Metropolitan Mobility Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Urban spatial telemetry, flood corridor vulnerability & multimodal load balancing for municipal authorities
          </p>
        </div>

        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl self-start md:self-auto">
          BMC Disaster Cell & Traffic Police Sandbox
        </span>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">City Congestion Index</div>
          <div className="text-2xl font-black text-[#0B1F3A] mt-1 font-mono-numbers">68%</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">Heavy on Western Express</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Public Transit Modal Share</div>
          <div className="text-2xl font-black text-[#2166F3] mt-1 font-mono-numbers">78.4%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Suburban Rail + Metro + BEST</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Subway Hazard Status</div>
          <div className="text-2xl font-black text-red-600 mt-1 font-mono-numbers">2 / 5</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Milan & Andheri Subways diverted</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Carbon Reduction vs Road</div>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-mono-numbers">-42%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Multimodal shift impact</div>
        </div>
      </div>

      {/* Corridor Speed & Vulnerability Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Spatial Map with Hazard Overlays */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0B1F3A]">
                High-Risk Corridors & Waterlogging Overlay
              </h3>
              <p className="text-xs text-slate-500">
                Spatial PostGIS polygon intersections with historical monsoon backflow
              </p>
            </div>
          </div>

          <div className="h-[360px] rounded-2xl overflow-hidden border border-slate-200">
            <MumbaiInteractiveMap showControls={true} />
          </div>
        </div>

        {/* Arterial Corridor Speeds */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#0B1F3A]">
            Corridor Velocity Telemetry
          </h3>
          <p className="text-xs text-slate-500">
            Current median speed vs free-flow speed
          </p>

          <div className="space-y-3 pt-1">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-xs font-bold text-[#0B1F3A] mb-1">
                <span>Western Express Highway (WEH)</span>
                <span className="font-mono-numbers text-red-600">18 km/h</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[32%]" />
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Normal: 45 km/h · Severe bottleneck near Vakola</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-xs font-bold text-[#0B1F3A] mb-1">
                <span>Bandra-Worli Sea Link</span>
                <span className="font-mono-numbers text-emerald-600">62 km/h</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[85%]" />
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Free flowing · Moderate coastal wind</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-xs font-bold text-[#0B1F3A] mb-1">
                <span>Eastern Express Highway (EEH)</span>
                <span className="font-mono-numbers text-amber-600">28 km/h</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[50%]" />
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Normal: 50 km/h · Slowdown near Amar Mahal</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-xs font-bold text-[#0B1F3A] mb-1">
                <span>JVLR (Jogeshwari-Vikhroli)</span>
                <span className="font-mono-numbers text-red-600">14 km/h</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[24%]" />
              </div>
              <div className="text-[10px] text-slate-500 mt-1">High congestion · Metro 6 construction corridor</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
