export type PersonaType = 'STUDENT' | 'NIGHT_TRAVELLER' | 'PROFESSIONAL' | 'FLEET_EMPLOYER';

export type TransportMode = 
  | 'walk' 
  | 'metro' 
  | 'train' 
  | 'bus' 
  | 'auto' 
  | 'cab' 
  | 'car' 
  | 'bike';

export type TimeType = 'leave_now' | 'leave_at' | 'arrive_by';

export interface UserPreferences {
  timeWeight: number;    // 0 to 1
  costWeight: number;    // 0 to 1
  safetyWeight: number;  // 0 to 1
  comfortWeight: number; // 0 to 1
  avoidSubwaysInRain: boolean;
  prioritizeWellLit: boolean;
  wheelchairAccessible: boolean;
}

export interface RouteLeg {
  id: string;
  mode: TransportMode;
  fromName: string;
  toName: string;
  distanceKm: number;
  durationMin: number;
  costInr: number;
  lineName?: string;
  crowdLevel?: 'Low' | 'Moderate' | 'High' | 'Packed' | 'Crush Load';
  lightingLevel?: 'Bright' | 'Moderate' | 'Poor';
  instructions: string;
  geometry: [number, number][]; // [lat, lng]
}

export interface RoutePlan {
  id: string;
  title: string;
  summary: string;
  modes: TransportMode[];
  legs: RouteLeg[];
  p50Minutes: number; // typical travel time
  p90Minutes: number; // worst-case travel time
  costInr: number;
  costBreakdown: {
    transitFare: number;
    firstLastMile: number;
    tollsAndSurge: number;
  };
  safetyScore: number;  // 0 - 100
  comfortScore: number; // 0 - 100
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Packed' | 'Crush Load';
  confidencePercent: number; // e.g. 90%
  compositeScore: number; // calculated score (lower is better ranked)
  recommended: boolean;
  recommendationTag?: 'BEST FOR YOU' | 'FASTEST' | 'CHEAPEST' | 'SAFEST' | 'MOST RELIABLE';
  whyReasons: string[];
  weightContributions: {
    time: number;
    cost: number;
    safety: number;
    comfort: number;
  };
  floodExposure: 'None' | 'Low' | 'Moderate' | 'High';
  nightSafetyHighlights?: string[];
  leaveByTime?: string;
  arriveByTime?: string;
  carbonKg?: number;
  onTimeProbability?: number;
  frequencyDescription?: string;
  delayReason?: string;
  primaryMode?: TransportMode;
}

export interface WeatherCondition {
  condition: string;
  temperatureC: number;
  rainfallMmPerHour: number;
  windSpeedKmh: number;
  visibilityKm: number;
  aqi: number;
  warningText?: string;
}

export interface TideCondition {
  currentLevelM: number;
  highTideTime: string;
  highTideHeightM: number;
  lowTideTime: string;
  lowTideHeightM: number;
  riskStatus: 'Normal' | 'Moderate Risk' | 'High Risk';
  coastalAdvisory: string;
}

export interface WaterloggingHotspot {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  severity: 'None' | 'Watch' | 'Waterlogged' | 'Critical';
  waterDepthCm: number;
  pumpsActive: number;
  trafficDiversionActive: boolean;
  description: string;
}

export interface TransitLineStatus {
  lineId: string;
  name: string;
  type: 'Local Train' | 'Metro' | 'BEST Bus';
  operator: 'Western Railway' | 'Central Railway' | 'MMRDA' | 'BEST';
  status: 'Normal' | 'Minor Delay' | 'Heavy Delay' | 'Suspended';
  delayMinutes: number;
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Crush Load';
  comfortTip: string;
}

export interface CityEvent {
  id: string;
  title: string;
  area: string;
  type: 'Marathon' | 'Procession' | 'Rally' | 'VIP Movement' | 'Roadwork';
  impactLevel: 'Low' | 'Moderate' | 'Severe';
  trafficMultiplier: number;
  affectedCorridors: string[];
  alternativeAdvice: string;
}

export interface AlertItem {
  id: string;
  category: 'Critical' | 'Warning' | 'Transit' | 'Weather' | 'Safety' | 'Events';
  title: string;
  location: string;
  timestamp: string;
  impact: string;
  recommendedAction: string;
  active: boolean;
}

export interface TrustedContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  avatarUrl?: string;
  isSharingActive: boolean;
}

export interface SavedTrip {
  id: string;
  origin: string;
  destination: string;
  date: string;
  modes: TransportMode[];
  durationMin: number;
  costInr: number;
  safetyScore: number;
  confidencePercent: number;
}

export interface DemoScenario {
  id: 'normal' | 'monsoon_tide' | 'night_traveller' | 'train_disruption' | 'event_shock';
  title: string;
  shortDesc: string;
  weather: WeatherCondition;
  tide: TideCondition;
  westernTrainStatus: TransitLineStatus['status'];
  waterloggingActive: boolean;
  nightMode: boolean;
  activeEvent?: CityEvent;
}

export type MapTileStyle = 
  | 'auto' 
  | 'maptiler_streets' 
  | 'maptiler_dark' 
  | 'maptiler_satellite' 
  | 'maptiler_outdoor' 
  | 'carto_voyager' 
  | 'carto_dark' 
  | 'osm_standard';
