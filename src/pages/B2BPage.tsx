import React, { useState } from 'react';
import { 
  Building2, 
  Truck, 
  Users, 
  ShieldCheck, 
  Clock, 
  IndianRupee, 
  TrendingUp, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Sparkles
} from 'lucide-react';

export const B2BPage: React.FC = () => {
  const [b2bTab, setB2bTab] = useState<'employer' | 'fleet'>('employer');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#2166F3]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A]">
              Enterprise Commute & Fleet Intelligence
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Predictive shift scheduling, flood-resilient staff transport, and multi-vehicle routing for Mumbai organizations
          </p>
        </div>

        {/* Segmented Mode Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setB2bTab('employer')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              b2bTab === 'employer' ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Employer Shift & Safety
          </button>
          <button
            onClick={() => setB2bTab('fleet')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              b2bTab === 'fleet' ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Commercial Fleet Logistics
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Active Commuters</div>
          <div className="text-2xl font-black text-[#0B1F3A] mt-1 font-mono-numbers">1,420</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">BKC & Powai Campuses</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">On-Time Arrival (P90)</div>
          <div className="text-2xl font-black text-[#2166F3] mt-1 font-mono-numbers">94.2%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">+18% vs unguided routing</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Night Safe Transit Shield</div>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-mono-numbers">100%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">380 late-shift journeys escorted</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">Monthly Fuel & Surge Saved</div>
          <div className="text-2xl font-black text-[#0B1F3A] mt-1 font-mono-numbers">₹3.8L</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Optimal modal switching</div>
        </div>
      </div>

      {/* Employer View */}
      {b2bTab === 'employer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Shift Schedule Optimizer */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0B1F3A]">
                  Dynamic Shift Schedule & Transit Buffer
                </h3>
                <p className="text-xs text-slate-500">
                  AI-recommended shift adjustments based on high tide and train maintenance blocks
                </p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">
                Monsoon Protocol Active
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-[#0B1F3A]">
                    Morning General Shift (09:00 - 18:00)
                  </div>
                  <div className="text-xs text-slate-500">
                    420 employees · Suburbs to BKC headquarters
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-[#2166F3] bg-blue-50 px-2.5 py-1 rounded-lg">
                    Recommendation: Shift arrival by -15 min
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Avoids 08:45 Kalanagar bottleneck
                  </div>
                </div>
              </div>

              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-[#0B1F3A]">
                    Evening Shift 2 (16:00 - 01:00)
                  </div>
                  <div className="text-xs text-slate-500">
                    280 employees · IT & Support Ops
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Night Safety Escort Mode Enabled
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Verified doorstep drop + live GPS circle
                  </div>
                </div>
              </div>

              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-[#0B1F3A]">
                    High Tide Early Release Trigger (13:30)
                  </div>
                  <div className="text-xs text-slate-500">
                    Automated advisory for employees living near Milan Subway & Sion
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg">
                    Standby Advisory
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Depart before 14:10 4.58m tidal surge
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Safety Shield Status */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#0B1F3A]">
              Corporate Duty of Care Status
            </h3>
            <p className="text-xs text-slate-500">
              Real-time monitoring of corporate cabs and employee commutes during severe weather
            </p>

            <div className="space-y-3 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Vehicles on Road</span>
                  <span className="font-mono-numbers text-[#2166F3]">34 / 34</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  All routed through flood-free elevated corridors.
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>SOS Incident Alerts</span>
                  <span className="font-mono-numbers text-emerald-600">0 Active</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Zero deviation anomalies detected in the last 24 hrs.
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Suburban Rail Stoppage Plan</span>
                  <span className="font-mono-numbers text-blue-600">Configured</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Automated switchover to BEST charter buses if railway delayed &gt; 30m.
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Fleet View */}
      {b2bTab === 'fleet' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0B1F3A]">
                Multi-Vehicle Flood-Aware Dispatch
              </h3>
              <p className="text-xs text-slate-500">
                Dynamic routing avoiding waterlogged underpasses, road digging & VIP convoys
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
              12 Active Shuttles Monitored
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
              <div className="flex items-center justify-between text-xs font-bold text-[#0B1F3A]">
                <span>Shuttle 04 (Andheri ↔ BKC)</span>
                <span className="text-emerald-700">On Time</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Route: Via Western Express Highway Flyover</div>
              <div className="text-xs text-slate-700 font-semibold mt-2">ETA: 09:18 AM · 24 Passengers</div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
              <div className="flex items-center justify-between text-xs font-bold text-[#0B1F3A]">
                <span>Shuttle 08 (Thane ↔ BKC)</span>
                <span className="text-amber-700">+8 min delay</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Route: Via Eastern Express & SCLR</div>
              <div className="text-xs text-slate-700 font-semibold mt-2">ETA: 09:32 AM · 30 Passengers</div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
              <div className="flex items-center justify-between text-xs font-bold text-[#0B1F3A]">
                <span>Shuttle 11 (Vashi ↔ BKC)</span>
                <span className="text-emerald-700">On Time</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Route: Via Sion-Panvel & Chunabhatti Connector</div>
              <div className="text-xs text-slate-700 font-semibold mt-2">ETA: 09:22 AM · 28 Passengers</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
