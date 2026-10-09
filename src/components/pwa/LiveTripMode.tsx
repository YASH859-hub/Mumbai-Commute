import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MumbaiInteractiveMap } from '../map/MumbaiInteractiveMap';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Share2, 
  PhoneCall, 
  Navigation, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Footprints,
  Train,
  Check,
  UserCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const LiveTripMode: React.FC = () => {
  const { 
    activeTripPlan, 
    endLiveTrip, 
    rerouteOffer, 
    applyReroute, 
    dismissReroute,
    trustedContacts,
    toggleContactSharing,
    saveCurrentTrip,
    tripProgressPercent,
    currentScenario
  } = useApp();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [tripCompleted, setTripCompleted] = useState(false);
  const [manualRerouteSimTriggered, setManualRerouteSimTriggered] = useState(false);

  if (!activeTripPlan) return null;

  const handleFinish = () => {
    setTripCompleted(true);
    saveCurrentTrip();
    setTimeout(() => {
      endLiveTrip();
      setTripCompleted(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 flex flex-col justify-between overflow-hidden">
      
      {/* Full-bleed Map Layer */}
      <div className="absolute inset-0 z-0">
        <MumbaiInteractiveMap showControls={false} />
      </div>

      {/* Floating Top Header (Status & ETA) */}
      <div className="relative z-20 p-4 pt-10 sm:pt-6 max-w-lg mx-auto w-full">
        <div className="glass-card-dark rounded-2xl p-4 text-white shadow-xl space-y-2 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Live Commute Active
              </span>
            </div>
            <div className="text-xs font-bold text-slate-300 font-mono-numbers">
              {currentScenario.weather.condition}
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">
                {activeTripPlan.title}
              </h2>
              <div className="text-xs text-slate-300">
                Andheri (W) → Bandra Kurla Complex (BKC)
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-black text-blue-300 font-mono-numbers">
                32 min
              </div>
              <div className="text-[11px] text-slate-300 font-mono-numbers">
                Arriving 09:22 AM
              </div>
            </div>
          </div>

          {/* Real-time progress bar */}
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-2">
            <div
              style={{ width: `${tripProgressPercent}%` }}
              className="bg-[#2166F3] h-full transition-all duration-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Floating Reroute Trigger Banner (Simulation) */}
      {rerouteOffer && rerouteOffer.visible && (
        <div className="relative z-30 px-4 max-w-lg mx-auto w-full animate-slide-up">
          <div className="bg-amber-500 text-slate-950 rounded-2xl p-4 shadow-2xl border-2 border-amber-300 space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-slate-950 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Disruption Warning
                </div>
                <div className="text-sm font-bold text-slate-950 mt-0.5">
                  {rerouteOffer.reason}
                </div>
                <div className="text-xs text-slate-900 mt-1">
                  {rerouteOffer.impactDescription}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={applyReroute}
                className="flex-1 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-900 active:scale-[0.98] transition-transform cursor-pointer"
              >
                Use Safer Route
              </button>
              <button
                onClick={dismissReroute}
                className="px-4 py-2 rounded-xl bg-white/80 text-slate-900 font-semibold text-xs hover:bg-white transition-colors cursor-pointer"
              >
                Keep Current
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trip Completed Overlay */}
      {tripCompleted && (
        <div className="relative z-30 px-4 max-w-lg mx-auto w-full">
          <div className="bg-emerald-600 text-white p-5 rounded-2xl shadow-xl text-center space-y-1">
            <CheckCircle2 className="w-8 h-8 mx-auto" />
            <h3 className="text-base font-bold">You Have Arrived!</h3>
            <p className="text-xs text-emerald-100">Journey saved to your personalized commute log.</p>
          </div>
        </div>
      )}

      {/* Floating Bottom Sheet (Itinerary & Controls) */}
      <div className="relative z-20 p-4 max-w-lg mx-auto w-full pb-8">
        <div className="glass-sheet rounded-3xl p-5 shadow-2xl space-y-4 border border-white/80">
          <div className="drag-handle" />

          {/* Current Step */}
          <div className="flex items-start gap-3 bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200/80">
            <div className="w-10 h-10 rounded-xl bg-[#2166F3] text-white flex items-center justify-center shrink-0">
              <Footprints className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2166F3]">
                NEXT STEP · 4 MIN
              </span>
              <h4 className="text-sm font-bold text-[#0B1F3A]">
                Walk south on Link Road to Andheri Metro Gate 3
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Then: Metro Aqua Line 3 directly to BKC
              </p>
            </div>
          </div>

          {/* Status & Safety Row */}
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Corridor Verified · 0m Deviation</span>
            </div>
            <span className="text-slate-400">Stationary: 0m</span>
          </div>

          {/* Bottom Action Grid */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#2166F3]" />
              <span>Share Trip</span>
            </button>

            <a
              href="tel:112"
              className="py-2.5 px-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS 112</span>
            </a>

            <button
              onClick={handleFinish}
              className="py-2.5 px-2 rounded-xl bg-[#0B1F3A] hover:bg-[#16305a] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Arrived</span>
            </button>
          </div>

        </div>
      </div>

      {/* Share Drawer */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="glass-sheet w-full max-w-md rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#0B1F3A]">Trip Safety Circle</h4>
                <p className="text-xs text-slate-500">Live GPS tracking shared with emergency contacts</p>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {trustedContacts.map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A]">{c.name}</div>
                    <div className="text-[11px] text-slate-500">{c.relation} · {c.phone}</div>
                  </div>
                  <button
                    onClick={() => toggleContactSharing(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      c.isSharingActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {c.isSharingActive ? 'Active' : 'Enable'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
