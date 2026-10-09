import React from 'react';
import { useApp } from '../../context/AppContext';
import { WATERLOGGING_HOTSPOTS } from '../../constants/mumbaiData';
import { Waves, CloudRain, AlertTriangle, ShieldCheck, Droplets, Info } from 'lucide-react';

export const FloodTideModule: React.FC = () => {
  const { currentScenario } = useApp();
  const { tide, weather } = currentScenario;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-600" />
            <h2 className="text-base sm:text-lg font-bold text-[#0B1F3A]">
              Flood & High Tide Intelligence Layer
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time storm runoff, Arabian Sea tidal levels & subways telemetry
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg border border-blue-200">
            BMC Coastal Sensor Feeds
          </span>
        </div>
      </div>

      {/* Tide & Weather Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* High Tide Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Next Spring High Tide</span>
            <span className={`font-bold ${
              tide.riskStatus === 'High Risk' ? 'text-red-600' : 'text-blue-600'
            }`}>
              {tide.riskStatus}
            </span>
          </div>
          <div className="text-2xl font-black text-[#0B1F3A] font-mono-numbers">
            {tide.highTideHeightM}m
          </div>
          <div className="text-xs text-slate-600 mt-1">
            Peak at <b className="text-slate-900 font-mono-numbers">{tide.highTideTime} hrs</b>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
            {tide.coastalAdvisory}
          </p>
        </div>

        {/* Rain Intensity Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Rainfall Rate</span>
            <CloudRain className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-[#0B1F3A] font-mono-numbers">
            {weather.rainfallMmPerHour} mm/hr
          </div>
          <div className="text-xs text-slate-600 mt-1">
            Status: <b className="text-slate-900">{weather.condition}</b>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {weather.warningText || 'Standard suburban precipitation profile.'}
          </p>
        </div>

        {/* Subways Status */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Active Culvert Pumps</span>
            <Droplets className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-[#0B1F3A] font-mono-numbers">
            18 / 22
          </div>
          <div className="text-xs text-slate-600 mt-1">
            Holding tanks: <b className="text-emerald-700">Dadar & Milan operational</b>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Underground drainage discharging at 3,200 liters/sec.
          </p>
        </div>

      </div>

      {/* Waterlogging Hotspots Status Table */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Monitored Mumbai Low-Lying Hotspots
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">Location</th>
                <th className="py-2.5 px-3 font-semibold">Area</th>
                <th className="py-2.5 px-3 font-semibold">Water Depth</th>
                <th className="py-2.5 px-3 font-semibold">Severity Status</th>
                <th className="py-2.5 px-3 font-semibold">Copilot Route Advisory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {WATERLOGGING_HOTSPOTS.map((spot) => (
                <tr key={spot.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-[#0B1F3A]">
                    {spot.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {spot.area}
                  </td>
                  <td className="py-3 px-3 font-mono-numbers">
                    <span className={`font-bold ${spot.waterDepthCm > 25 ? 'text-red-600' : 'text-slate-800'}`}>
                      {spot.waterDepthCm} cm
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      spot.severity === 'Critical'
                        ? 'bg-red-100 text-red-800'
                        : spot.severity === 'Waterlogged'
                        ? 'bg-amber-100 text-amber-800'
                        : spot.severity === 'Watch'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {spot.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs">
                    {spot.trafficDiversionActive 
                      ? 'Diversion in effect: System rerouting trips via Metro or elevated flyovers.' 
                      : 'Slow vehicular speed; flyover recommended.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
