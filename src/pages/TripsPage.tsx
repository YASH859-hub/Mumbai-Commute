import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LiveTripMode } from '../components/pwa/LiveTripMode';
import { 
  MapPin, 
  RotateCcw, 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  Share2, 
  Plus, 
  UserCheck, 
  Navigation,
  CheckCircle2
} from 'lucide-react';

export const TripsPage: React.FC = () => {
  const { 
    isTripActive, 
    savedTrips, 
    trustedContacts, 
    addTrustedContact, 
    toggleContactSharing,
    startLiveTrip,
    routes,
    setActiveTab 
  } = useApp();

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    addTrustedContact(newContactName, 'Family', newContactPhone);
    setNewContactName('');
    setNewContactPhone('');
    setIsAddingContact(false);
  };

  // If live trip is in progress, switch directly into full-screen Live Trip Mode!
  if (isTripActive) {
    return <LiveTripMode />;
  }

  return (
    <div className="max-w-lg lg:max-w-5xl mx-auto w-full space-y-5 pb-24 p-3 sm:p-6">
      
      {/* Header Glass Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-lg border border-white/70 flex items-center justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-[#0B1F3A] dark:text-white">
            Trips & Safety Shield
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Past commute telemetry & verified emergency circle
          </p>
        </div>

        <button
          onClick={() => {
            if (routes.length > 0) startLiveTrip(routes[0]);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2166F3] hover:bg-[#1a55cc] rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Launch Trip</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left / Main: Recent Trips Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recent Commute History
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {savedTrips.length} logged journeys
            </span>
          </div>

          {savedTrips.map((trip) => (
            <div
              key={trip.id}
              className="glass-card rounded-2xl p-4 sm:p-5 shadow-xs border border-white/80 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 block">
                    {trip.date}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#0B1F3A] dark:text-white mt-0.5">
                    {trip.origin} → {trip.destination}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveTab('plan')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  <span>Repeat</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-slate-50/70 dark:bg-slate-800 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Duration</span>
                  <span className="font-extrabold text-[#0B1F3A] dark:text-white font-mono-numbers">
                    {trip.durationMin}m
                  </span>
                </div>
                <div className="bg-slate-50/70 dark:bg-slate-800 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Fare</span>
                  <span className="font-extrabold text-slate-900 dark:text-white font-mono-numbers">
                    ₹{trip.costInr}
                  </span>
                </div>
                <div className="bg-slate-50/70 dark:bg-slate-800 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">Safety</span>
                  <span className="font-extrabold text-emerald-700 font-mono-numbers">
                    {trip.safetyScore}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Trusted Contacts Safety Circle */}
        <div className="lg:col-span-5 space-y-3">
          <div className="glass-card rounded-3xl p-5 shadow-xs border border-white/70 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Safety Circle
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Live location sharing during night trips
                </p>
              </div>
              <button
                onClick={() => setIsAddingContact(!isAddingContact)}
                className="text-xs font-bold text-[#2166F3] hover:underline cursor-pointer"
              >
                + Add
              </button>
            </div>

            {isAddingContact && (
              <form onSubmit={handleAddSubmit} className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Contact Name (e.g. Mom)"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone (+91 ...)"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none"
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="px-3 py-1 bg-[#2166F3] text-white font-bold rounded-lg cursor-pointer">
                    Save
                  </button>
                  <button type="button" onClick={() => setIsAddingContact(false)} className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg cursor-pointer">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {trustedContacts.map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] dark:text-white flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{c.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{c.phone}</div>
                  </div>
                  <button
                    onClick={() => toggleContactSharing(c.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-xl cursor-pointer ${
                      c.isSharingActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {c.isSharingActive ? 'Active' : 'Enable'}
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 rounded-2xl text-[11px] leading-relaxed border border-blue-100 dark:border-blue-900">
              Verified contacts receive automatic SMS/WhatsApp alerts if your route deviates &gt; 500m or halts stationary unexpectedly.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
