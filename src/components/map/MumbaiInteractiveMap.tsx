import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { MUMBAI_LOCATIONS, WATERLOGGING_HOTSPOTS } from '../../constants/mumbaiData';
import { Layers, AlertTriangle, ShieldCheck, Waves, Train, Eye, Map, Key, Satellite } from 'lucide-react';
import { MapTileStyle } from '../../types';

function getTileConfiguration(style: MapTileStyle, apiKey: string, isNight: boolean) {
  let tileUrl = '';
  let tileSize = 256;
  let zoomOffset = 0;
  let subdomains: string | string[] = 'abcd';
  let maxZoom = 19;
  let label = 'CartoDB Voyager';

  // Fallback to active MapTiler key provided by user
  const defaultKey = 'Ms7NAh05h9A2EKCedGeR';
  const key = (apiKey && apiKey.trim()) || defaultKey;

  if (style === 'auto') {
    if (apiKey) {
      if (isNight) {
        tileUrl = `https://api.maptiler.com/maps/dataviz-dark/{z}/{x}/{y}.png?key=${apiKey}`;
        tileSize = 512;
        zoomOffset = -1;
        subdomains = [];
        label = 'MapTiler Dark';
      } else {
        tileUrl = `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${apiKey}`;
        tileSize = 512;
        zoomOffset = -1;
        subdomains = [];
        label = 'MapTiler Streets';
      }
    } else {
      if (isNight) {
        tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        label = 'CartoDB Dark';
      } else {
        tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        label = 'CartoDB Voyager';
      }
    }
  } else if (style === 'maptiler_streets') {
    tileUrl = `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`;
    tileSize = 512;
    zoomOffset = -1;
    subdomains = [];
    label = 'MapTiler Streets';
  } else if (style === 'maptiler_dark') {
    tileUrl = `https://api.maptiler.com/maps/dataviz-dark/{z}/{x}/{y}.png?key=${key}`;
    tileSize = 512;
    zoomOffset = -1;
    subdomains = [];
    label = 'MapTiler Dark';
  } else if (style === 'maptiler_satellite') {
    // MapTiler Hybrid v4: Aerial satellite photography with roads, labels and transit lines
    tileUrl = `https://api.maptiler.com/maps/hybrid-v4/{z}/{x}/{y}.jpg?key=${key}`;
    tileSize = 512;
    zoomOffset = -1;
    subdomains = [];
    maxZoom = 20;
    label = 'MapTiler Satellite Hybrid (hybrid-v4)';
  } else if (style === 'maptiler_outdoor') {
    tileUrl = `https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${key}`;
    tileSize = 512;
    zoomOffset = -1;
    subdomains = [];
    label = 'MapTiler Outdoor';
  } else if (style === 'carto_dark') {
    tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    label = 'CartoDB Dark';
  } else if (style === 'osm_standard') {
    tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    subdomains = ['a', 'b', 'c'];
    label = 'OpenStreetMap';
  } else {
    // carto_voyager
    tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    label = 'CartoDB Voyager';
  }

  return { tileUrl, tileSize, zoomOffset, subdomains, maxZoom, label };
}

export const MumbaiInteractiveMap: React.FC<{
  className?: string;
  showControls?: boolean;
  compact?: boolean;
}> = ({ className = 'h-full min-h-[360px]', showControls = true, compact = false }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const { 
    originId, 
    destinationId, 
    selectedRoute, 
    currentScenarioId, 
    isTripActive, 
    tripProgressPercent,
    isNightMode,
    mapLayers,
    toggleMapLayer,
    mapTileStyle,
    setMapTileStyle,
    mapTilerApiKey,
    setIsMapSettingsOpen
  } = useApp();

  const showFloodLayer = mapLayers.flood;
  const showTransitLayer = mapLayers.transit;
  const showTrafficLayer = mapLayers.traffic;

  const currentTileConfig = getTileConfiguration(mapTileStyle, mapTilerApiKey, isNightMode);

  // 1. Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered around Mumbai suburban corridor (Andheri-Bandra-BKC)
    const map = L.map(mapContainerRef.current, {
      center: [19.0759, 72.8550],
      zoom: 12,
      zoomControl: !compact,
      attributionControl: false,
    });

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    // Force resize calculation
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };
  }, [compact]);

  // 2. Dynamically update Tile Layer whenever style, API key, or night mode changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const { tileUrl, tileSize, zoomOffset, subdomains, maxZoom } = getTileConfiguration(
      mapTileStyle,
      mapTilerApiKey,
      isNightMode
    );

    const newTileLayer = L.tileLayer(tileUrl, {
      maxZoom,
      subdomains,
      tileSize,
      zoomOffset,
    });

    newTileLayer.addTo(map);
    // ensure tile layer stays at the bottom beneath markers and routes
    newTileLayer.bringToBack();
    tileLayerRef.current = newTileLayer;
  }, [mapTileStyle, mapTilerApiKey, isNightMode]);

  // Update Map Markers & Geometry whenever routes/scenarios change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const lg = layerGroupRef.current;
    if (!map || !lg) return;

    lg.clearLayers();

    const originLoc = MUMBAI_LOCATIONS.find((l) => l.id === originId) || MUMBAI_LOCATIONS[0];
    const destLoc = MUMBAI_LOCATIONS.find((l) => l.id === destinationId) || MUMBAI_LOCATIONS[1];

    // Origin Marker (Teal Pulse)
    const originIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #16A878; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">
          A
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const originMarker = L.marker([originLoc.lat, originLoc.lng], { icon: originIcon })
      .bindPopup(`<b>Start: ${originLoc.shortName}</b><br/><span style="font-size:12px;color:#666">${originLoc.address}</span>`);
    lg.addLayer(originMarker);

    // Destination Marker (Navy / Red Pin)
    const destIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #0B1F3A; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">
          B
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const destMarker = L.marker([destLoc.lat, destLoc.lng], { icon: destIcon })
      .bindPopup(`<b>Destination: ${destLoc.shortName}</b><br/><span style="font-size:12px;color:#666">${destLoc.address}</span>`);
    lg.addLayer(destMarker);

    // Render Route Polylines
    if (selectedRoute && selectedRoute.legs && selectedRoute.legs.length > 0) {
      selectedRoute.legs.forEach((leg, idx) => {
        let legColor = '#2166F3'; // default blue
        let dashArray = undefined;

        if (leg.mode === 'walk') {
          legColor = '#16A878';
          dashArray = '5, 8';
        } else if (leg.mode === 'metro') {
          legColor = '#059669';
        } else if (leg.mode === 'train') {
          legColor = '#E11D48';
        } else if (leg.mode === 'bus') {
          legColor = '#D97706';
        } else if (leg.mode === 'cab') {
          legColor = '#2563EB';
        } else if (leg.mode === 'auto') {
          legColor = '#7C3AED';
        }

        const poly = L.polyline(leg.geometry, {
          color: legColor,
          weight: 6,
          opacity: 0.9,
          dashArray,
          lineCap: 'round',
          lineJoin: 'round',
        });
        poly.bindPopup(`<b>${leg.instructions}</b><br/>${leg.distanceKm} km · ${leg.durationMin} min`);
        lg.addLayer(poly);
      });

      // Fit bounds to show entire route
      const allCoords = selectedRoute.legs.flatMap((l) => l.geometry);
      if (allCoords.length > 0) {
        map.fitBounds(L.latLngBounds(allCoords), { padding: [40, 40] });
      }
    }

    // Live Trip User Location simulation marker
    if (isTripActive && selectedRoute) {
      const allCoords = selectedRoute.legs.flatMap((l) => l.geometry);
      const stepIdx = Math.min(
        Math.floor((tripProgressPercent / 100) * allCoords.length),
        allCoords.length - 1
      );
      const curCoord = allCoords[stepIdx] || [originLoc.lat, originLoc.lng];

      const userGpsIcon = L.divIcon({
        className: 'user-gps-icon',
        html: `
          <div style="position: relative;">
            <div style="width: 22px; height: 22px; background: #2166F3; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 14px rgba(33,102,243,0.8);"></div>
            <div style="position: absolute; top: -6px; left: -6px; width: 34px; height: 34px; border: 2px solid #2166F3; border-radius: 50%; opacity: 0.6;"></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const userMarker = L.marker(curCoord, { icon: userGpsIcon }).bindPopup('<b>Current Position</b><br/>Live telemetry');
      lg.addLayer(userMarker);
    }

    // Waterlogging & Flood Zones layer
    if (showFloodLayer) {
      WATERLOGGING_HOTSPOTS.forEach((spot) => {
        const isCritical = spot.severity === 'Critical' || spot.severity === 'Waterlogged';
        const color = spot.severity === 'Critical' ? '#E5484D' : spot.severity === 'Waterlogged' ? '#F59E0B' : '#3B82F6';

        // Circular hazard radius
        const circle = L.circle([spot.lat, spot.lng], {
          radius: 350,
          color: color,
          fillColor: color,
          fillOpacity: 0.25,
          weight: 2,
        });

        circle.bindPopup(`
          <div style="padding: 4px; font-family: sans-serif;">
            <b style="color: ${color};">${spot.name}</b>
            <div style="font-size: 11px; margin-top: 4px;">Severity: <b>${spot.severity}</b> (${spot.waterDepthCm}cm)</div>
            <div style="font-size: 11px; color: #555; margin-top: 2px;">${spot.description}</div>
            <div style="font-size: 10px; color: #777; margin-top: 4px;">Pumps Active: ${spot.pumpsActive} · BMC Disaster Cell</div>
          </div>
        `);
        lg.addLayer(circle);
      });
    }

    // High Tide coastal marker (Worli / Marine Drive)
    if (showFloodLayer && (currentScenarioId === 'monsoon_tide' || currentScenarioId === 'normal')) {
      const tideIcon = L.divIcon({
        className: 'tide-marker-icon',
        html: `
          <div style="background: #0284c7; color: white; border-radius: 8px; padding: 3px 6px; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); white-space: nowrap; display: flex; align-items: center; gap: 4px;">
            <span>🌊 4.58m Tide</span>
          </div>
        `,
        iconSize: [80, 24],
        iconAnchor: [40, 12],
      });
      const tideMarker = L.marker([18.9950, 72.8120], { icon: tideIcon })
        .bindPopup('<b>High Tide Point: Mahim/Worli Coast</b><br/>Gates throttled at Britannia Outfall.');
      lg.addLayer(tideMarker);
    }

    // Event polygon for Marathon / VIP movement
    if (currentScenarioId === 'event_shock') {
      const eventPoly = L.polygon([
        [19.0550, 72.8250],
        [19.0400, 72.8200],
        [19.0150, 72.8150],
        [19.0200, 72.8250],
        [19.0580, 72.8350],
      ], {
        color: '#dc2626',
        fillColor: '#ef4444',
        fillOpacity: 0.3,
        weight: 2,
        dashArray: '4, 4',
      });
      eventPoly.bindPopup('<b>Bandra-Worli Marathon Buffer Zone</b><br/>Traffic Diversions Active. Use Metro 3.');
      lg.addLayer(eventPoly);
    }

  }, [
    originId, 
    destinationId, 
    selectedRoute, 
    currentScenarioId, 
    showFloodLayer, 
    showTransitLayer, 
    showTrafficLayer,
    isTripActive,
    tripProgressPercent
  ]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100 ${className}`}>
      
      {/* Map DOM target */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px] z-0" />

      {/* Layer Controls Pill Bar (Top Right) */}
      {showControls && (
        <div className="absolute top-3 right-3 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-1.5 border border-slate-200/90 dark:border-slate-800 shadow-md flex items-center gap-1">
          {/* 🛰️ Satellite Hybrid Quick Toggle Button */}
          <button
            onClick={() => {
              if (mapTileStyle === 'maptiler_satellite') {
                setMapTileStyle('auto');
              } else {
                setMapTileStyle('maptiler_satellite');
              }
            }}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              mapTileStyle === 'maptiler_satellite'
                ? 'bg-slate-950 text-amber-300 ring-2 ring-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Toggle MapTiler Hybrid v4 Satellite Map"
          >
            <Satellite className={`w-3.5 h-3.5 ${mapTileStyle === 'maptiler_satellite' ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Satellite Hybrid</span>
            {mapTileStyle === 'maptiler_satellite' && (
              <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1 rounded-sm uppercase tracking-wider">LIVE</span>
            )}
          </button>

          <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          <button
            onClick={() => toggleMapLayer('flood')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              showFloodLayer 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Toggle Waterlogging & Tide Risk"
          >
            <Waves className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Flood Risk</span>
          </button>

          <button
            onClick={() => toggleMapLayer('transit')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              showTransitLayer 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Toggle Train & Metro Networks"
          >
            <Train className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Transit</span>
          </button>

          <button
            onClick={() => setIsMapSettingsOpen(true)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
            title="Map Style & MapTiles API Key Settings"
          >
            <Map className="w-3.5 h-3.5 text-[#2166F3]" />
            <span className="hidden sm:inline">Tiles & Key</span>
          </button>
        </div>
      )}

      {/* Map Legend Overlay (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-md rounded-xl px-3 py-2 border border-slate-200/80 shadow-xs text-[11px] text-slate-700 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A878] shrink-0" />
          <span className="font-medium">Origin</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#0B1F3A] shrink-0 ml-1.5" />
          <span className="font-medium">Destination</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <span className="w-3 h-1 bg-[#2166F3] rounded-full inline-block" />
          <span>Active Recommendation</span>
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block ml-1" />
          <span>Hazard Hotspot</span>
        </div>
      </div>

      {/* Active Map Tile Provider Badge (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-10">
        <button
          onClick={() => setIsMapSettingsOpen(true)}
          className={`backdrop-blur-md px-2.5 py-1 rounded-lg border shadow-2xs text-[10px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
            mapTileStyle === 'maptiler_satellite'
              ? 'bg-slate-900/90 text-amber-300 border-amber-400/40 hover:bg-slate-900'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-white'
          }`}
          title="Click to configure MapTiles API Key or change map style"
        >
          {mapTileStyle === 'maptiler_satellite' ? (
            <Satellite className="w-3 h-3 text-amber-400 animate-pulse" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-[#2166F3]" />
          )}
          <span>Tile Layer: <strong>{currentTileConfig.label}</strong></span>
          {mapTilerApiKey && (
            <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1 rounded font-bold">Key ON</span>
          )}
        </button>
      </div>

    </div>
  );
};
