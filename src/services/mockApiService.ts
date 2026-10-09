import { AlertItem, PersonaType, RoutePlan, UserPreferences } from '../types';
import { calculateLeaveByTime, scoreAndRankRoutes } from './scoringEngine';
import { MUMBAI_LOCATIONS, LocationNode } from '../constants/mumbaiData';

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(1.5, Math.round(R * c * 10) / 10);
}

function interpolateCoords(
  start: [number, number],
  end: [number, number],
  steps: number,
  curvature: number = 0
): [number, number][] {
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = start[0] + (end[0] - start[0]) * t;
    // apply slight longitudinal curvature based on sine wave to simulate roads/tracks
    const curveOffset = Math.sin(t * Math.PI) * curvature;
    const lng = start[1] + (end[1] - start[1]) * t + curveOffset;
    coords.push([Number(lat.toFixed(5)), Number(lng.toFixed(5))]);
  }
  return coords;
}

export interface PlanApiRequest {
  originId: string;
  destinationId: string;
  timeType: 'leave_now' | 'leave_at' | 'arrive_by';
  targetTime: string;
  persona: PersonaType;
  weights: UserPreferences;
  scenarioId?: string;
}

export interface PlanApiResponse {
  requestId: string;
  originName: string;
  destinationName: string;
  leaveBy: string;
  confidencePercent: number;
  plans: RoutePlan[];
  alerts: AlertItem[];
  generatedAt: string;
  dataState: 'MOCK_DATA' | 'SIMULATED_ENGINE';
}

/**
 * Returns candidate routes adapted to the given Mumbai locations and scenario.
 */
export function getCandidateRoutes(
  originId: string,
  destinationId: string,
  scenarioId: string = 'normal'
): RoutePlan[] {
  const isMonsoon = scenarioId === 'monsoon_tide';
  const isNight = scenarioId === 'night_traveller';
  const isTrainDisrupted = scenarioId === 'train_disruption';
  const isEvent = scenarioId === 'event_shock';

  const originNode = MUMBAI_LOCATIONS.find((l) => l.id === originId) || MUMBAI_LOCATIONS[0];
  const destNode = MUMBAI_LOCATIONS.find((l) => l.id === destinationId) || MUMBAI_LOCATIONS[1];

  const dist = getDistanceKm(originNode.lat, originNode.lng, destNode.lat, destNode.lng);

  // 1. LOCAL TRAIN OPTION (Suburban Railway Artery)
  const trainBaseTime = Math.max(16, Math.round(dist * 1.45 + 10));
  const pTrain_time = isTrainDisrupted ? trainBaseTime + 35 : (isMonsoon ? trainBaseTime + 14 : trainBaseTime);
  const pTrain_p90 = isTrainDisrupted ? pTrain_time + 18 : (isMonsoon ? pTrain_time + 15 : pTrain_time + 8);
  const trainFare = Math.min(25, Math.max(10, Math.round(dist * 1.2)));
  const trainFirstLastMile = 30; // auto/rickshaw feeder

  const trainStationOrigin = originNode.stationNear || `${originNode.shortName} Station`;
  const trainStationDest = destNode.stationNear || `${destNode.shortName} Station`;

  const planTrain: RoutePlan = {
    id: 'plan_train_auto',
    title: 'Local Train (Suburban Rail)',
    summary: `Fastest suburban railway artery via ${trainStationOrigin} to ${trainStationDest}`,
    modes: ['auto', 'train', 'walk'],
    primaryMode: 'train',
    p50Minutes: pTrain_time,
    p90Minutes: pTrain_p90,
    costInr: trainFare + trainFirstLastMile,
    costBreakdown: {
      transitFare: trainFare,
      firstLastMile: trainFirstLastMile,
      tollsAndSurge: 0,
    },
    safetyScore: isNight ? 76 : 82,
    comfortScore: isTrainDisrupted ? 42 : 72,
    crowdLevel: isTrainDisrupted ? 'Crush Load' : 'High',
    confidencePercent: isTrainDisrupted ? 54 : (isMonsoon ? 72 : 94),
    compositeScore: 0,
    recommended: false,
    carbonKg: Math.round(dist * 0.016 * 100) / 100,
    onTimeProbability: isTrainDisrupted ? 52 : (isMonsoon ? 76 : 94),
    frequencyDescription: 'Suburban trains run every 3–4 minutes (Fast / Slow corridor)',
    delayReason: isTrainDisrupted
      ? 'Western Railway signal overhaul at Dadar: +35m delay'
      : isMonsoon
      ? 'Culvert flood watch near Sion/Matunga: +10m speed restriction'
      : 'Timetable running normally on schedule',
    whyReasons: [
      isTrainDisrupted
        ? 'CAUTION: Signal overhaul causing heavy delays on suburban line'
        : 'Dedicated railway right-of-way bypasses all road gridlock & signals',
      `Suburban train fare capped at ₹${trainFare} (lowest cost corridor)`,
      'High departure frequency every 3–4 mins',
      isMonsoon ? 'Track waterlogging risk near low-lying culverts' : 'Fast transit speed between major junctions'
    ],
    weightContributions: { time: 45, cost: 35, safety: 10, comfort: 10 },
    floodExposure: isMonsoon ? 'Moderate' : 'Low',
    nightSafetyHighlights: ['RPF security escorts on evening trains', 'Ladies compartment with dedicated emergency alarm'],
    legs: [
      {
        id: 'leg_tr_1',
        mode: 'auto',
        fromName: originNode.shortName,
        toName: trainStationOrigin,
        distanceKm: Math.max(0.8, Math.round(dist * 0.15 * 10) / 10),
        durationMin: 7,
        costInr: trainFirstLastMile,
        instructions: `Quick auto ride to ${trainStationOrigin}`,
        lightingLevel: 'Moderate',
        geometry: interpolateCoords([originNode.lat, originNode.lng], [originNode.lat - 0.005, originNode.lng + 0.008], 3, -0.002)
      },
      {
        id: 'leg_tr_2',
        mode: 'train',
        fromName: trainStationOrigin,
        toName: trainStationDest,
        distanceKm: Math.round(dist * 0.75 * 10) / 10,
        durationMin: isTrainDisrupted ? 45 : Math.max(12, Math.round(dist * 1.1)),
        costInr: trainFare,
        lineName: 'Western / Central Suburban Local',
        crowdLevel: isTrainDisrupted ? 'Crush Load' : 'High',
        instructions: `Board fast local train towards ${trainStationDest}`,
        geometry: interpolateCoords([originNode.lat - 0.005, originNode.lng + 0.008], [destNode.lat + 0.004, destNode.lng - 0.006], 6, 0.008)
      },
      {
        id: 'leg_tr_3',
        mode: 'walk',
        fromName: trainStationDest,
        toName: destNode.shortName,
        distanceKm: Math.max(0.4, Math.round(dist * 0.1 * 10) / 10),
        durationMin: 6,
        costInr: 0,
        instructions: `Walk from station exit / skywalk to ${destNode.shortName}`,
        lightingLevel: 'Bright',
        geometry: interpolateCoords([destNode.lat + 0.004, destNode.lng - 0.006], [destNode.lat, destNode.lng], 3, 0.001)
      }
    ]
  };

  // 2. BEST BUS OPTION (Electric AC Express Bus)
  const busBaseTime = Math.max(22, Math.round(dist * 2.4 + 10));
  const pBus_time = isMonsoon ? busBaseTime + 18 : (isEvent ? busBaseTime + 28 : busBaseTime);
  const pBus_p90 = isMonsoon ? pBus_time + 20 : (isEvent ? pBus_time + 25 : pBus_time + 12);
  const busFare = Math.min(35, Math.max(15, Math.round(dist * 1.8)));

  const planBus: RoutePlan = {
    id: 'plan_bus_direct',
    title: 'BEST AC Express Bus',
    summary: `Direct air-conditioned electric bus via arterial road network`,
    modes: ['walk', 'bus', 'walk'],
    primaryMode: 'bus',
    p50Minutes: pBus_time,
    p90Minutes: pBus_p90,
    costInr: busFare,
    costBreakdown: {
      transitFare: busFare,
      firstLastMile: 0,
      tollsAndSurge: 0,
    },
    safetyScore: 88,
    comfortScore: 84,
    crowdLevel: 'Moderate',
    confidencePercent: isEvent ? 62 : (isMonsoon ? 72 : 84),
    compositeScore: 0,
    recommended: false,
    carbonKg: Math.round(dist * 0.032 * 100) / 100,
    onTimeProbability: isMonsoon ? 70 : 84,
    frequencyDescription: 'BEST AC feeder departs every 8–10 minutes',
    delayReason: isMonsoon
      ? 'Surface waterlogging near subways and low visibility: +18m'
      : isEvent
      ? 'Traffic diversion around marathon route: +25m'
      : 'Moderate arterial junction delays near signals',
    whyReasons: [
      'Direct sit-down AC ride with zero vehicle transfers',
      `Affordable AC bus fare capped at ₹${busFare}`,
      isMonsoon ? 'Subject to surface street waterlogging near low-lying junctions' : 'Smooth highway ride on Western Express Highway',
      'No walking between crowded rail interchange bridges'
    ],
    weightContributions: { time: 20, cost: 45, safety: 20, comfort: 15 },
    floodExposure: isMonsoon ? 'Moderate' : 'Low',
    legs: [
      {
        id: 'leg_bus_1',
        mode: 'walk',
        fromName: originNode.shortName,
        toName: 'BEST Bus Shelter',
        distanceKm: 0.3,
        durationMin: 4,
        costInr: 0,
        instructions: 'Walk to nearest BEST shelter',
        lightingLevel: 'Bright',
        geometry: interpolateCoords([originNode.lat, originNode.lng], [originNode.lat + 0.002, originNode.lng + 0.003], 2, 0)
      },
      {
        id: 'leg_bus_2',
        mode: 'bus',
        fromName: 'BEST Bus Shelter',
        toName: `${destNode.shortName} Bus Stop`,
        distanceKm: Math.round(dist * 10) / 10,
        durationMin: Math.max(14, pBus_time - 9),
        costInr: busFare,
        lineName: 'BEST Route AC Express',
        crowdLevel: 'Moderate',
        instructions: `Ride electric AC bus towards ${destNode.shortName}`,
        geometry: interpolateCoords([originNode.lat + 0.002, originNode.lng + 0.003], [destNode.lat - 0.002, destNode.lng - 0.002], 7, -0.01)
      },
      {
        id: 'leg_bus_3',
        mode: 'walk',
        fromName: `${destNode.shortName} Bus Stop`,
        toName: destNode.shortName,
        distanceKm: 0.3,
        durationMin: 5,
        costInr: 0,
        instructions: `Walk from bus shelter to destination`,
        lightingLevel: 'Bright',
        geometry: interpolateCoords([destNode.lat - 0.002, destNode.lng - 0.002], [destNode.lat, destNode.lng], 2, 0)
      }
    ]
  };

  // 3. TAXI / CAB OPTION (Kaali Peeli / App Cab / Uber)
  const cabBaseTime = Math.max(18, Math.round(dist * 2.1 + 8));
  const pCab_time = isMonsoon ? cabBaseTime + 26 : (isEvent ? cabBaseTime + 36 : cabBaseTime);
  const pCab_p90 = isMonsoon ? pCab_time + 24 : (isEvent ? pCab_time + 28 : pCab_time + 14);
  const surgeMultiplier = isMonsoon ? 1.45 : (isEvent ? 1.3 : 1.15);
  const cabCost = Math.max(120, Math.round((55 + dist * 19.5) * surgeMultiplier));

  const planCab: RoutePlan = {
    id: 'plan_cab_direct',
    title: 'Taxi / Cab (Expressway & Flyovers)',
    summary: `Door-to-door private cab via arterial expressway & flyovers`,
    modes: ['cab'],
    primaryMode: 'cab',
    p50Minutes: pCab_time,
    p90Minutes: pCab_p90,
    costInr: cabCost,
    costBreakdown: {
      transitFare: 0,
      firstLastMile: 0,
      tollsAndSurge: cabCost,
    },
    safetyScore: isNight ? 86 : 89,
    comfortScore: 92,
    crowdLevel: 'Low',
    confidencePercent: isMonsoon ? 62 : (isEvent ? 60 : 78),
    compositeScore: 0,
    recommended: false,
    carbonKg: Math.round(dist * 0.175 * 100) / 100,
    onTimeProbability: isMonsoon ? 64 : 76,
    frequencyDescription: 'On-demand ride dispatch (average 3–5 min pickup wait)',
    delayReason: isMonsoon
      ? 'Expressway gridlock near Milan subway & waterlogged bottlenecks: +26m'
      : isEvent
      ? 'Sea Link & VIP convoy roadblock: +36m'
      : 'Peak hour junction queue near flyover bottlenecks (+10m)',
    whyReasons: [
      'Private air-conditioned door-to-door convenience',
      isMonsoon
        ? 'High traffic delay: Expressway bottle-necks and surface puddles reduce speed to 16 km/h'
        : 'Convenient if carrying luggage or traveling with family',
      isEvent ? 'Severe congestion penalty (+36 min delay from diversions)' : 'Surge pricing active during peak travel windows',
      `Significantly more expensive (₹${cabCost}) than public rail or bus`
    ],
    weightContributions: { time: 30, cost: 10, safety: 20, comfort: 40 },
    floodExposure: isMonsoon ? 'High' : 'None',
    legs: [
      {
        id: 'leg_cab_1',
        mode: 'cab',
        fromName: `${originNode.shortName} Doorstep`,
        toName: `${destNode.shortName} Destination`,
        distanceKm: Math.round(dist * 1.15 * 10) / 10,
        durationMin: pCab_time,
        costInr: cabCost,
        instructions: `Drive via arterial highway & flyovers directly to destination`,
        lightingLevel: 'Bright',
        geometry: interpolateCoords([originNode.lat, originNode.lng], [destNode.lat, destNode.lng], 8, 0.015)
      }
    ]
  };

  // 4. METRO + TRANSIT OPTION
  const metroBaseTime = Math.max(20, Math.round(dist * 1.7 + 10));
  const pMetro_time = isMonsoon ? metroBaseTime + 2 : metroBaseTime;
  const pMetro_p90 = pMetro_time + 6;
  const planMetro: RoutePlan = {
    id: 'plan_metro_walk',
    title: 'Metro + Walk',
    summary: 'Elevated & underground rail bypasses all surface flood zones and road congestion',
    modes: ['walk', 'metro', 'walk'],
    primaryMode: 'metro',
    p50Minutes: pMetro_time,
    p90Minutes: pMetro_p90,
    costInr: 40,
    costBreakdown: {
      transitFare: 40,
      firstLastMile: 0,
      tollsAndSurge: 0,
    },
    safetyScore: isNight ? 95 : 92,
    comfortScore: 90,
    crowdLevel: isTrainDisrupted ? 'High' : 'Moderate',
    confidencePercent: 92,
    compositeScore: 0,
    recommended: false,
    carbonKg: Math.round(dist * 0.02 * 100) / 100,
    onTimeProbability: 95,
    frequencyDescription: 'Metro trains every 4 minutes with CBTC signaling',
    delayReason: 'Zero surface traffic interference; 99.4% punctual',
    whyReasons: [
      isMonsoon
        ? 'Bypasses waterlogged surface roads and subways completely'
        : 'Predictable transit schedule unaffected by surface highway congestion',
      'Dedicated air-conditioned rolling stock with platform screen doors',
      'Zero flood exposure across underground and elevated stations',
      'Tight P50-P90 variance with highest on-time arrival guarantee'
    ],
    weightContributions: { time: 35, cost: 20, safety: 30, comfort: 15 },
    floodExposure: 'None',
    nightSafetyHighlights: ['Continuous CCTV & security guards at all platforms', 'Bright LED lit walking paths outside station concourse'],
    legs: [
      {
        id: 'leg_m_1',
        mode: 'walk',
        fromName: originNode.shortName,
        toName: 'Metro Station Concourse',
        distanceKm: 0.5,
        durationMin: 6,
        costInr: 0,
        instructions: 'Walk to nearest Metro gate',
        lightingLevel: 'Bright',
        geometry: interpolateCoords([originNode.lat, originNode.lng], [originNode.lat + 0.003, originNode.lng + 0.004], 2, 0)
      },
      {
        id: 'leg_m_2',
        mode: 'metro',
        fromName: 'Metro Station Concourse',
        toName: `${destNode.shortName} Metro Station`,
        distanceKm: Math.round(dist * 0.9 * 10) / 10,
        durationMin: Math.max(10, pMetro_time - 12),
        costInr: 40,
        lineName: 'Metro Line 3 Aqua / Line 1 Connector',
        crowdLevel: 'Moderate',
        instructions: 'Board Metro train towards destination corridor',
        geometry: interpolateCoords([originNode.lat + 0.003, originNode.lng + 0.004], [destNode.lat - 0.003, destNode.lng - 0.003], 6, -0.005)
      },
      {
        id: 'leg_m_3',
        mode: 'walk',
        fromName: `${destNode.shortName} Metro Station`,
        toName: destNode.shortName,
        distanceKm: 0.4,
        durationMin: 6,
        costInr: 0,
        instructions: 'Exit via Skywalk towards destination',
        lightingLevel: 'Bright',
        geometry: interpolateCoords([destNode.lat - 0.003, destNode.lng - 0.003], [destNode.lat, destNode.lng], 2, 0)
      }
    ]
  };

  // 5. DIRECT AUTO RICKSHAW OPTION
  const autoBaseTime = Math.max(18, Math.round(dist * 2.3 + 7));
  const pAuto_time = isMonsoon ? autoBaseTime + 20 : autoBaseTime;
  const pAuto_p90 = isMonsoon ? pAuto_time + 18 : pAuto_time + 12;
  const autoFare = Math.max(35, Math.round(23 + dist * 15.3));

  const planAuto: RoutePlan = {
    id: 'plan_auto_direct',
    title: 'Direct Auto Rickshaw',
    summary: 'Metered suburban auto rickshaw across arterial link roads',
    modes: ['auto'],
    primaryMode: 'auto',
    p50Minutes: pAuto_time,
    p90Minutes: pAuto_p90,
    costInr: autoFare,
    costBreakdown: {
      transitFare: 0,
      firstLastMile: 0,
      tollsAndSurge: autoFare,
    },
    safetyScore: isNight ? 76 : 82,
    comfortScore: 68,
    crowdLevel: 'Low',
    confidencePercent: 74,
    compositeScore: 0,
    recommended: false,
    carbonKg: Math.round(dist * 0.08 * 100) / 100,
    onTimeProbability: 78,
    frequencyDescription: 'Available immediately at street stands',
    delayReason: isMonsoon ? 'Subject to rain spray and puddle slowdown' : 'Flexible local lane maneuvering',
    whyReasons: [
      'Direct doorstep drop without booking app wait times',
      'Metered government fare with zero surge surcharge',
      isMonsoon ? 'High exposure to rain spray and surface puddle waterlogging' : 'Flexible maneuvering through suburban traffic jams'
    ],
    weightContributions: { time: 30, cost: 35, safety: 20, comfort: 15 },
    floodExposure: isMonsoon ? 'High' : 'Low',
    legs: [
      {
        id: 'leg_auto_1',
        mode: 'auto',
        fromName: `${originNode.shortName} Stand`,
        toName: destNode.shortName,
        distanceKm: Math.round(dist * 10) / 10,
        durationMin: pAuto_time,
        costInr: autoFare,
        instructions: 'Ride metered auto rickshaw to destination',
        lightingLevel: 'Moderate',
        geometry: interpolateCoords([originNode.lat, originNode.lng], [destNode.lat, destNode.lng], 6, 0.008)
      }
    ]
  };

  return [planMetro, planTrain, planBus, planCab, planAuto];
}

/**
 * Mock API endpoint simulation matching POST /v1/plan
 */
export async function planCommuteApi(
  req: PlanApiRequest
): Promise<PlanApiResponse> {
  // Simulate network latency (250ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  const candidatePlans = getCandidateRoutes(
    req.originId,
    req.destinationId,
    req.scenarioId
  );

  // Score and rank routes according to user's weights
  const scoredPlans = scoreAndRankRoutes(candidatePlans, req.weights);

  // Best plan calculation
  const bestPlan = scoredPlans[0];
  const { leaveByTime } = calculateLeaveByTime(
    req.targetTime || '09:30',
    bestPlan ? bestPlan.p90Minutes : 45
  );

  // Populate dynamic leave-by for each plan
  const finalPlans = scoredPlans.map((p) => {
    const { leaveByTime: planLeaveBy } = calculateLeaveByTime(
      req.targetTime || '09:30',
      p.p90Minutes
    );
    return {
      ...p,
      leaveByTime: planLeaveBy,
      arriveByTime: req.targetTime || '09:30',
    };
  });

  // Dynamic alerts
  const alerts: AlertItem[] = [];
  if (req.scenarioId === 'monsoon_tide') {
    alerts.push({
      id: 'alt_tide',
      category: 'Critical',
      title: 'Spring High Tide of 4.58m at 14:10',
      location: 'Marine Drive & Mahim Bay Coastal Outlets',
      timestamp: 'Active Now',
      impact: 'Storm drains locked to prevent sea backflow. Waterlogging in low subways.',
      recommendedAction: 'Take Metro Line 3 or elevated flyovers; avoid Milan & Andheri Subways.',
      active: true,
    });
    alerts.push({
      id: 'alt_rain',
      category: 'Weather',
      title: 'Monsoon Heavy Cloudburst (48mm/hr)',
      location: 'Western Suburban Corridor (Andheri to Bandra)',
      timestamp: '15 min ago',
      impact: 'Surface visibility < 2km; WEH vehicle speeds down to 18 km/h.',
      recommendedAction: 'Public rail and metro recommended over road taxis.',
      active: true,
    });
  } else if (req.scenarioId === 'train_disruption') {
    alerts.push({
      id: 'alt_train',
      category: 'Transit',
      title: 'Western Railway Signal Overhaul at Dadar',
      location: 'Dadar to Mahim track switch',
      timestamp: '10 min ago',
      impact: 'Down fast trains held; slow trains delayed by 35-40 mins.',
      recommendedAction: 'Shift to Metro Line 1 & Line 3 Aqua, or BEST Electric AC Bus.',
      active: true,
    });
  } else if (req.scenarioId === 'event_shock') {
    alerts.push({
      id: 'alt_event',
      category: 'Events',
      title: 'Mumbai City Half-Marathon & Sea Link Convoy',
      location: 'Bandra-Worli Sea Link to Kalanagar',
      timestamp: '6:00 AM – 11:30 AM',
      impact: 'Sea Link northbound closed. SV Road traffic multiplier 2.4x.',
      recommendedAction: 'Metro Line 3 Underground is fully operational and unaffected.',
      active: true,
    });
  } else if (req.scenarioId === 'night_traveller') {
    alerts.push({
      id: 'alt_night',
      category: 'Safety',
      title: 'Night Travel Safety Shield Active',
      location: 'City-wide',
      timestamp: '23:30',
      impact: 'Lighting and station security scoring prioritized. Trip sharing enabled.',
      recommendedAction: 'Stay on well-lit major arterial roads and metro skywalks.',
      active: true,
    });
  }

  const originNode = MUMBAI_LOCATIONS.find((l) => l.id === req.originId) || MUMBAI_LOCATIONS[0];
  const destNode = MUMBAI_LOCATIONS.find((l) => l.id === req.destinationId) || MUMBAI_LOCATIONS[1];

  return {
    requestId: 'req_' + Math.random().toString(36).substring(2, 9),
    originName: originNode.name,
    destinationName: destNode.name,
    leaveBy: leaveByTime,
    confidencePercent: bestPlan ? bestPlan.confidencePercent : 90,
    plans: finalPlans,
    alerts,
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dataState: 'SIMULATED_ENGINE',
  };
}
