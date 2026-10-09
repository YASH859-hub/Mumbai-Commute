import React from 'react';
import { EXPANSION_ROADMAP } from '../../constants/techStack';
import { X, Map, Compass, CheckCircle2, Milestone, ArrowRight, ShieldCheck } from 'lucide-react';

export const RoadmapModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const capabilities = [
    { title: 'Crowd-Sourced Hazard Reporting', desc: 'Real-time commuter telemetry on potholes, waterlogging depth, and BEST bus breakdowns.', status: 'Active Development' },
    { title: 'Multilingual Voice Assistant', desc: 'Contextual voice query engine supporting colloquial Mumbai Marathi, Bambaiya Hindi, and Indian English.', status: 'Beta' },
    { title: 'Local Train Carriage Crowd Vision', desc: 'Real-time carriage loading heatmaps combining turnstile taps and historical platform density.', status: 'Phase 2' },
    { title: 'B2B Fleet & Shift Dispatch Engine', desc: 'Automated staff pickup routing minimizing transit time through flood-safe corridors.', status: 'Pilot' },
    { title: 'Spatio-Temporal Graph Neural Network', desc: 'PyTorch Geometric architecture modeling dynamic traffic propagation across Mumbai bottle-necks.', status: 'Research' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <Milestone className="w-5 h-5 text-[#2166F3]" />
              <h2 className="text-lg font-bold text-[#0B1F3A]">
                Product Roadmap & Pan-India Expansion
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              From Mumbai's monsoon resilience to pan-Indian metropolitan multimodal optimization
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
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Pan India Metros Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                City Rollout Pipeline (Labeled: Future Scope)
              </h3>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Future Scope
              </span>
            </div>

            <div className="space-y-3">
              {EXPANSION_ROADMAP.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.active 
                      ? 'bg-blue-50/60 border-blue-200' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#0B1F3A]">
                          {item.city}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          ({item.state})
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.active 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-600 mt-0.5">
                        {item.phase}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {item.features.map((feat, fidx) => (
                      <span key={fidx} className="text-[11px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-lg">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities Roadmap */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Core Capabilities in Development
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {capabilities.map((c, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#0B1F3A]">{c.title}</h4>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Vision 2026-2027 · Multimodal Urban Mobility</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer min-h-[40px]"
          >
            Close Roadmap
          </button>
        </div>

      </div>
    </div>
  );
};
