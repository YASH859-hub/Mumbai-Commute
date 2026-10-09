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
  UserCheck
} from 'lucide-react';

export const LiveTripTracker: React.FC = () => {
  const { 
    activeTripPlan, 
    endLiveTrip, 
    rerouteOffer, 
    applyReroute, 
    dismissReroute,
    trustedContacts,
    toggleContactSharing,
    saveCurrentTrip,
    tripProgressPercent 
  } = useApp();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [tripCompleted, setTripCompleted] = useState(false);

  if (!activeTripPlan) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 max-w-md mx-auto my-8">
        <Navigation className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#0B1F3A]">No Trip Currently in Progress</h3>
        <p className="text-xs text-slate-500 mt-1 mb-5">
          Select a recommended commute plan from the planner to launch turn-by-turn guidance.
        </p>
      </div>
    );
  }

  const handleFinishTrip = () => {
    setTripCompleted(true);
    saveCurrentTrip();
    setTimeout(() => {
      endLiveTrip();
      setTripCompleted(false);
    }, 2200);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      
      {/* Dynamic Reroute Alert Banner (if triggered) */}
      {rerouteOffer && rerouteOffer.visible && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-lg animate-bounce-once">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                  Live Corridor Disruption Alert
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  Real-time Recalculation
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#0B1F3A] mt-1">
                {rerouteOffer.reason}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {rerouteOffer.impactDescription}
              </p>

              {/* Reroute Actions */}
              <div className="flex items-center gap-2.5 mt-3 pt-2">
                <button
                  onClick={applyReroute}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#16A878] hover:bg-[#128a63] rounded-xl shadow-xs transition-colors cursor-pointer min-h-[40px]"
                >
                  Switch to Safer Route (+6 min)
                </button>
                <button
                  onClick={dismissReroute}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl transition-colors cursor-pointer min-h-[40px]"
                >
                  Stay on Current Route
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal / Toast */}
      {tripCompleted && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
          <h4 className="text-sm font-bold text-emerald-900">Journey Completed Successfully</h4>
          <p className="text-xs text-emerald-700">Trip logged to your personalized commute history.</p>
        </div>
      )}

      {/* Live Navigation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        
        {/* Top Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                Live Trip Copilot Active
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-mono-numbers">
                ETA: {activeTripPlan.arriveByTime || '09:28 AM'}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#0B1F3A] mt-0.5">
              {activeTripPlan.title}
            </h2>
          </div>

          {/* Quick Actions (Share & Emergency) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShareModalOpen(!isShareModalOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer min-h-[40px]"
            >
              <Share2 className="w-3.5 h-3.5 text-[#2166F3]" />
              <span>Share Trip</span>
            </button>
            <a
              href="tel:112"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer min-h-[40px]"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS 112</span>
            </a>
          </div>
        </div>

        {/* Live Map Frame */}
        <div className="my-4 h-[280px] sm:h-[340px] rounded-2xl overflow-hidden border border-slate-200">
          <MumbaiInteractiveMap showControls={false} />
        </div>

        {/* Progress & Deviation Bar */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Route Progress</span>
            <span className="font-mono-numbers">{tripProgressPercent}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div 
              style={{ width: `${tripProgressPercent}%` }}
              className="bg-[#2166F3] h-full transition-all duration-500 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              On scheduled corridor · Zero deviation detected
            </span>
            <span>Stationary: 0m</span>
          </div>
        </div>

        {/* Step-by-Step Leg Guidance */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Trip Itinerary Steps
          </h4>
          <div className="space-y-2.5">
            {activeTripPlan.legs.map((leg, idx) => (
              <div 
                key={leg.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  idx === 0 
                    ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-300' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  idx === 0 ? 'bg-[#2166F3] text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {idx === 0 ? <Footprints className="w-4 h-4" /> : <Train className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B1F3A]">
                      Step {idx + 1}: {leg.instructions}
                    </span>
                    <span className="text-[11px] font-mono-numbers text-slate-500">
                      {leg.durationMin} min · {leg.distanceKm} km
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    From <b>{leg.fromName}</b> to <b>{leg.toName}</b>
                    {leg.lineName && ` · ${leg.lineName}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Finish CTA */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={endLiveTrip}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer min-h-[44px]"
          >
            Cancel Trip
          </button>
          <button
            onClick={handleFinishTrip}
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#0B1F3A] hover:bg-[#153463] rounded-xl shadow-xs transition-colors cursor-pointer min-h-[44px]"
          >
            Arrived at Destination
          </button>
        </div>

      </div>

      {/* Trusted Contact Sharing Drawer */}
      {isShareModalOpen && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-[#0B1F3A]">Trip Safety Circle</h4>
              <p className="text-xs text-slate-500">Live GPS telemetry shared with verified emergency contacts</p>
            </div>
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Done
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-3">
            {trustedContacts.map((contact) => (
              <div key={contact.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#0B1F3A]">{contact.name}</div>
                  <div className="text-[11px] text-slate-500">{contact.relation} · {contact.phone}</div>
                </div>
                <button
                  onClick={() => toggleContactSharing(contact.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    contact.isSharingActive 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {contact.isSharingActive ? 'Active Sharing' : 'Enable'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
