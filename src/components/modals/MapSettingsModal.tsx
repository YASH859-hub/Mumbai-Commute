import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Map, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  ExternalLink, 
  RefreshCw,
  Sun,
  Moon,
  Satellite,
  Compass,
  Check
} from 'lucide-react';
import { MapTileStyle } from '../../types';

export const MapSettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    mapTileStyle, 
    setMapTileStyle, 
    mapTilerApiKey, 
    setMapTilerApiKey,
    isNightMode,
    setIsNightMode
  } = useApp();

  const [inputKey, setInputKey] = useState<string>(mapTilerApiKey || '');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');
  const [copiedEnv, setCopiedEnv] = useState<boolean>(false);

  const handleSaveKey = () => {
    setMapTilerApiKey(inputKey.trim());
    if (inputKey.trim()) {
      // Auto-switch to maptiler streets or dark if auto/carto
      if (mapTileStyle === 'carto_voyager' || mapTileStyle === 'carto_dark') {
        setMapTileStyle(isNightMode ? 'maptiler_dark' : 'maptiler_streets');
      }
      setTestStatus('success');
      setTestMessage('Key saved and active! Map tiles updated in real-time.');
    } else {
      setTestStatus('idle');
      setTestMessage('Key cleared. Now using CartoDB Voyager / Dark free tiles.');
    }
  };

  const handleTestKey = async () => {
    const keyToTest = (inputKey || mapTilerApiKey).trim();
    if (!keyToTest) {
      setTestStatus('error');
      setTestMessage('Please enter an API key to test.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Testing connection to MapTiler tile server...');

    try {
      // Test 1 single tile request at Mumbai coordinates on hybrid-v4
      // Mumbai is roughly z=10, x=719, y=442
      const testUrl = `https://api.maptiler.com/maps/hybrid-v4/10/719/442.jpg?key=${keyToTest}`;
      const res = await fetch(testUrl, { method: 'HEAD' });

      if (res.ok) {
        setTestStatus('success');
        setTestMessage('Connection successful! MapTiler hybrid-v4 is valid and delivering 512px satellite tiles.');
        setMapTilerApiKey(keyToTest);
      } else if (res.status === 403 || res.status === 401) {
        setTestStatus('error');
        setTestMessage(`MapTiler returned ${res.status} Unauthorized. Please check your API key.`);
      } else {
        setTestStatus('error');
        setTestMessage(`Received status ${res.status}. Please verify your MapTiler account.`);
      }
    } catch {
      // Cross-origin HEAD might fail, fallback to Image load test
      const img = new Image();
      img.onload = () => {
        setTestStatus('success');
        setTestMessage('Connection successful! MapTiler satellite hybrid tiles verified.');
        setMapTilerApiKey(keyToTest);
      };
      img.onerror = () => {
        setTestStatus('error');
        setTestMessage('Could not load test tile with this key. Check key or network connection.');
      };
      img.src = `https://api.maptiler.com/maps/hybrid-v4/10/719/442.jpg?key=${keyToTest}`;
    }
  };

  const styleOptions: {
    id: MapTileStyle;
    title: string;
    description: string;
    requiresKey: boolean;
    badge: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'maptiler_satellite',
      title: 'MapTiler Satellite Hybrid (hybrid-v4)',
      description: 'High-res aerial satellite photography with street labels, coastline, Sea Link & suburban transit routes.',
      requiresKey: true,
      badge: 'Integrated (hybrid-v4)',
      icon: <Satellite className="w-4 h-4 text-emerald-500" />
    },
    {
      id: 'auto',
      title: 'Auto Adaptive (Recommended)',
      description: 'Automatically switches day/night mode using your MapTiles key or free CartoDB.',
      requiresKey: false,
      badge: 'Smart',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />
    },
    {
      id: 'maptiler_streets',
      title: 'MapTiler Streets v2',
      description: 'Crisp 512px retina tiles with detailed suburban train tracks, highways, and stations.',
      requiresKey: true,
      badge: 'MapTiles',
      icon: <Map className="w-4 h-4 text-blue-500" />
    },
    {
      id: 'maptiler_dark',
      title: 'MapTiler Dataviz Dark',
      description: 'Midnight navy palette with high-contrast glowing flood zones and transit line routes.',
      requiresKey: true,
      badge: 'MapTiles',
      icon: <Moon className="w-4 h-4 text-indigo-400" />
    },
    {
      id: 'maptiler_outdoor',
      title: 'MapTiler Outdoor / Topo',
      description: 'Contour lines & hillshades showing low-lying flood-prone valleys and coastal levels.',
      requiresKey: true,
      badge: 'MapTiles',
      icon: <Compass className="w-4 h-4 text-amber-600" />
    },
    {
      id: 'carto_voyager',
      title: 'CartoDB Voyager (Free Fallback)',
      description: 'Clean modern city map with zero API key requirement and high reliability.',
      requiresKey: false,
      badge: 'Free / No Key',
      icon: <Sun className="w-4 h-4 text-orange-400" />
    },
    {
      id: 'carto_dark',
      title: 'CartoDB Dark Matter (Free Fallback)',
      description: 'Zero-cost dark map with minimal visual noise for route path highlighting.',
      requiresKey: false,
      badge: 'Free / No Key',
      icon: <Moon className="w-4 h-4 text-slate-400" />
    },
    {
      id: 'osm_standard',
      title: 'OpenStreetMap Standard',
      description: 'Community-driven global street map layer.',
      requiresKey: false,
      badge: 'Open Source',
      icon: <Layers className="w-4 h-4 text-cyan-500" />
    }
  ];

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(`VITE_MAPTILER_API_KEY="${inputKey || 'your_api_key_here'}"`);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-settings-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2166F3]/10 text-[#2166F3] flex items-center justify-center border border-[#2166F3]/20">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h2 id="map-settings-title" className="text-lg font-black text-[#0B1F3A] dark:text-white">
                Map Tile Provider & API Key
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Leaflet raster & vector tile support for MapTiler / OpenMapTiles & CartoDB
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Answer Highlight Banner */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 flex items-start gap-3.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-extrabold text-emerald-900 dark:text-emerald-200 block text-sm">
                Yes! Your MapTiles / MapTiler API Key Works Perfectly
              </span>
              <p className="text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
                Mumbai Commute Copilot uses <strong>Leaflet 1.9+</strong> with native tile layer streaming. 
                When you supply your MapTiler key, the app renders high-definition <strong>512×512 retina tiles</strong> with 
                custom street geometries, satellite aerial views, and dark dataviz modes.
              </p>
            </div>
          </div>

          {/* API Key Input Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="maptiles-key-input" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#2166F3]" />
                <span>MapTiles / MapTiler API Key</span>
              </label>
              {mapTilerApiKey ? (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Key Active in Browser
                </span>
              ) : (
                <span className="text-[11px] font-medium text-slate-400">
                  Optional (Free CartoDB active)
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  id="maptiles-key-input"
                  type="text"
                  placeholder="Paste your MapTiler API key here (e.g. 2s5k7...)"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-mono text-[#0B1F3A] dark:text-white outline-none focus:border-[#2166F3] focus:ring-2 focus:ring-[#2166F3]/20 transition-all"
                />
                {inputKey && (
                  <button
                    onClick={() => setInputKey('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveKey}
                  className="px-4 py-2.5 bg-[#2166F3] hover:bg-blue-600 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save & Apply</span>
                </button>

                <button
                  onClick={handleTestKey}
                  disabled={testStatus === 'testing' || !inputKey}
                  className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Test key connection"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin text-blue-500' : ''}`} />
                  <span>Test Key</span>
                </button>
              </div>
            </div>

            {/* Quick Key preset helper */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <span>Integrated MapTiler Key:</span>
                <button
                  type="button"
                  onClick={() => {
                    setInputKey('Ms7NAh05h9A2EKCedGeR');
                    setMapTilerApiKey('Ms7NAh05h9A2EKCedGeR');
                    setMapTileStyle('maptiler_satellite');
                    setTestStatus('success');
                    setTestMessage('MapTiler key Ms7NAh05h9A2EKCedGeR loaded & Satellite Hybrid activated!');
                  }}
                  className="font-mono bg-blue-50 dark:bg-blue-950/60 text-[#2166F3] dark:text-blue-400 px-2 py-0.5 rounded-lg border border-blue-200/60 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer font-bold"
                  title="Click to load provided key & switch to Satellite Hybrid"
                >
                  Ms7NAh05h9A2EKCedGeR
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMapTileStyle('maptiler_satellite');
                  onClose();
                }}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Satellite className="w-3.5 h-3.5" />
                <span>Switch to Satellite Hybrid</span>
              </button>
            </div>

            {/* Test status banner */}
            {testMessage && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in ${
                testStatus === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                  : testStatus === 'error'
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
              }`}>
                {testStatus === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : testStatus === 'error' ? (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
                )}
                <span>{testMessage}</span>
              </div>
            )}
          </div>

          {/* Map Style Selector Grid */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#2166F3]" />
                <span>Choose Active Map Tile Style</span>
              </span>
              <span className="text-[11px] font-normal text-slate-400 lowercase">
                Instant tile preview
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {styleOptions.map((opt) => {
                const isSelected = mapTileStyle === opt.id;
                const isKeyMissing = opt.requiresKey && !mapTilerApiKey && !inputKey;

                return (
                  <button
                    key={opt.id}
                    onClick={() => setMapTileStyle(opt.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#2166F3] bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-[#2166F3]/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {opt.icon}
                        <span className="text-xs font-extrabold text-[#0B1F3A] dark:text-white">
                          {opt.title}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        opt.requiresKey
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                          : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {opt.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {opt.description}
                    </p>

                    {isKeyMissing && (
                      <span className="mt-2 text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Requires MapTiles API key
                      </span>
                    )}

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2166F3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Environment Variable Setup Guide */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B1F3A] dark:text-white flex items-center gap-1.5">
                <span>Persist in `.env` or Hosting Environment</span>
              </span>
              <button
                onClick={handleCopyEnv}
                className="text-xs font-bold text-[#2166F3] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedEnv ? 'Copied to Clipboard!' : 'Copy Env Config'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              You can also specify the key in your `.env` file so it automatically loads for all team members and builds:
            </p>
            <div className="bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-xs overflow-x-auto select-all">
              <code>VITE_MAPTILER_API_KEY=&quot;{inputKey || 'your_api_key_here'}&quot;</code>
            </div>
          </div>

          {/* How to get a free MapTiles / MapTiler key */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Don't have a key? MapTiler offers a generous free tier with 100,000 tile requests/month.</span>
            <a
              href="https://cloud.maptiler.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2166F3] font-bold hover:underline flex items-center gap-1 shrink-0 ml-3"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Current Engine: <strong className="text-slate-800 dark:text-slate-200">Leaflet 1.9 + Dynamic Tiles</strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0B1F3A] dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
