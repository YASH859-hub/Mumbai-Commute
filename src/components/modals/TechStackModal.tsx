import React from 'react';
import { useApp } from '../../context/AppContext';
import { TECH_STACK_ITEMS, SUCCESS_METRICS } from '../../constants/techStack';
import { X, Cpu, CheckCircle2, ShieldCheck, Database, Server, Layers, Sliders, Box, GitBranch } from 'lucide-react';

export const TechStackModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#2166F3]" />
              <h2 className="text-lg font-bold text-[#0B1F3A]">
                Engineering Architecture & Production Tech Stack
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Designed for high-throughput spatial routing, quantile ML latency, and BMC flood telemetry
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6">
          
          {/* Architecture Pipeline Flow Diagram */}
          <div className="bg-gradient-to-r from-[#0B1F3A] to-[#153463] text-white p-5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-3">
              Data Ingestion & Inference Pipeline
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-[10px]">
              <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                <div className="font-bold text-white">01. INGESTION</div>
                <div className="text-blue-200 mt-1">Traffic, Weather, Tide, BMC</div>
              </div>
              <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                <div className="font-bold text-white">02. SPATIAL DB</div>
                <div className="text-blue-200 mt-1">PostGIS 16 + Redis Cache</div>
              </div>
              <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                <div className="font-bold text-white">03. FEATURE STORE</div>
                <div className="text-blue-200 mt-1">Corridor historical speeds</div>
              </div>
              <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                <div className="font-bold text-white">04. ML SERVICE</div>
                <div className="text-blue-200 mt-1">LightGBM (P50 & P90)</div>
              </div>
              <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                <div className="font-bold text-white">05. ROUTING</div>
                <div className="text-blue-200 mt-1">Valhalla + OTP 2.4</div>
              </div>
              <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                <div className="font-bold text-white">06. SCORING</div>
                <div className="text-blue-200 mt-1">SHAP attribution</div>
              </div>
              <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                <div className="font-bold text-white">07. CLIENT</div>
                <div className="text-blue-200 mt-1">React PWA + Leaflet</div>
              </div>
            </div>
          </div>

          {/* Model Targets & Benchmark Metrics */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Performance & Reliability Targets (Validation Metrics)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {SUCCESS_METRICS.map((metric, idx) => (
                <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-500">
                    {metric.metric}
                  </div>
                  <div className="text-xl font-extrabold text-[#0B1F3A] mt-1 font-mono-numbers">
                    {metric.value}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    Target: {metric.target} ({metric.status})
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {metric.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Specifications Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              System Components & Framework Stack
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TECH_STACK_ITEMS.map((tech, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition-colors flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2166F3] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0B1F3A]">
                        {tech.name}
                      </span>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {tech.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      {tech.category}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {tech.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>NEXATHON 2026 · HACKCARTEL Production Readiness Report</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-white bg-[#0B1F3A] hover:bg-[#183664] rounded-xl transition-colors cursor-pointer min-h-[40px]"
          >
            Close Specs
          </button>
        </div>

      </div>
    </div>
  );
};
