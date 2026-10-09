import { PersonaType, RoutePlan, UserPreferences } from '../types';

export const DEFAULT_PERSONA_PRESETS: Record<PersonaType, UserPreferences> = {
  STUDENT: {
    timeWeight: 0.25,
    costWeight: 0.50,
    safetyWeight: 0.15,
    comfortWeight: 0.10,
    avoidSubwaysInRain: true,
    prioritizeWellLit: false,
    wheelchairAccessible: false,
  },
  NIGHT_TRAVELLER: {
    timeWeight: 0.20,
    costWeight: 0.10,
    safetyWeight: 0.55,
    comfortWeight: 0.15,
    avoidSubwaysInRain: true,
    prioritizeWellLit: true,
    wheelchairAccessible: false,
  },
  PROFESSIONAL: {
    timeWeight: 0.50,
    costWeight: 0.10,
    safetyWeight: 0.15,
    comfortWeight: 0.25,
    avoidSubwaysInRain: true,
    prioritizeWellLit: false,
    wheelchairAccessible: false,
  },
  FLEET_EMPLOYER: {
    timeWeight: 0.35,
    costWeight: 0.30,
    safetyWeight: 0.25,
    comfortWeight: 0.10,
    avoidSubwaysInRain: true,
    prioritizeWellLit: true,
    wheelchairAccessible: false,
  },
};

/**
 * Normalizes an array of RoutePlans and calculates their composite score
 * based on user weights:
 * Score(p) = w_time * norm(Time) + w_cost * norm(Cost) + w_safety * (1 - norm(Safety)) + w_comfort * (1 - norm(Comfort))
 * Lower score = better recommendation.
 */
export function scoreAndRankRoutes(
  routes: RoutePlan[],
  weights: UserPreferences
): RoutePlan[] {
  if (routes.length === 0) return [];

  // Find min and max for normalization
  const times = routes.map((r) => r.p50Minutes);
  const costs = routes.map((r) => r.costInr);
  const safeties = routes.map((r) => r.safetyScore);
  const comforts = routes.map((r) => r.comfortScore);

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);
  const minSafety = Math.min(...safeties);
  const maxSafety = Math.max(...safeties);
  const minComfort = Math.min(...comforts);
  const maxComfort = Math.max(...comforts);

  // Normalize total weights to sum to 1
  const rawWeightSum =
    weights.timeWeight +
    weights.costWeight +
    weights.safetyWeight +
    weights.comfortWeight;
  const totalWeight = rawWeightSum > 0 ? rawWeightSum : 1;

  const wTime = weights.timeWeight / totalWeight;
  const wCost = weights.costWeight / totalWeight;
  const wSafety = weights.safetyWeight / totalWeight;
  const wComfort = weights.comfortWeight / totalWeight;

  const scored = routes.map((route) => {
    // Normalization functions (0 to 1)
    const normTime = maxTime === minTime ? 0.5 : (route.p50Minutes - minTime) / (maxTime - minTime);
    const normCost = maxCost === minCost ? 0.5 : (route.costInr - minCost) / (maxCost - minCost);
    const normSafety = maxSafety === minSafety ? 0.5 : (route.safetyScore - minSafety) / (maxSafety - minSafety);
    const normComfort = maxComfort === minComfort ? 0.5 : (route.comfortScore - minComfort) / (maxComfort - minComfort);

    // Higher safety & comfort means lower penalty: (1 - norm)
    const timeTerm = wTime * normTime;
    const costTerm = wCost * normCost;
    const safetyTerm = wSafety * (1 - normSafety);
    const comfortTerm = wComfort * (1 - normComfort);

    const compositeScore = Number((timeTerm + costTerm + safetyTerm + comfortTerm).toFixed(4));

    // Dynamic weight contributions for explainability
    const totalTerm = timeTerm + costTerm + safetyTerm + comfortTerm || 1;
    const weightContributions = {
      time: Math.round((wTime) * 100),
      cost: Math.round((wCost) * 100),
      safety: Math.round((wSafety) * 100),
      comfort: Math.round((wComfort) * 100),
    };

    return {
      ...route,
      compositeScore,
      weightContributions,
    };
  });

  // Sort ascending by compositeScore (lower is better)
  scored.sort((a, b) => a.compositeScore - b.compositeScore);

  // Assign recommendation flags
  const result = scored.map((route, index) => {
    let recommendationTag: RoutePlan['recommendationTag'];
    if (index === 0) {
      if (wCost >= 0.45) recommendationTag = 'CHEAPEST';
      else if (wSafety >= 0.45) recommendationTag = 'SAFEST';
      else if (wTime >= 0.45) recommendationTag = 'FASTEST';
      else recommendationTag = 'BEST FOR YOU';
    }

    return {
      ...route,
      recommended: index === 0,
      recommendationTag,
    };
  });

  return result;
}

/**
 * Calculates Leave-By time given an Arrive-By target and P90 uncertainty buffer
 * e.g., Arrive at 09:30, P90 is 55 mins -> Leave at 08:35
 */
export function calculateLeaveByTime(
  arriveByTimeStr: string,
  p90Minutes: number
): { leaveByTime: string; bufferMinutes: number } {
  const [hStr, mStr] = arriveByTimeStr.split(':');
  const targetHour = parseInt(hStr, 10) || 9;
  const targetMin = parseInt(mStr, 10) || 30;

  const totalTargetMinutes = targetHour * 60 + targetMin;
  const leaveMinutesTotal = totalTargetMinutes - p90Minutes;

  // Handle midnight wrap if needed
  const normalizedLeaveMinutes = (leaveMinutesTotal + 24 * 60) % (24 * 60);
  const leaveHour = Math.floor(normalizedLeaveMinutes / 60);
  const leaveMin = normalizedLeaveMinutes % 60;

  const leaveByTime = `${leaveHour.toString().padStart(2, '0')}:${leaveMin.toString().padStart(2, '0')}`;
  return {
    leaveByTime,
    bufferMinutes: Math.max(5, Math.round(p90Minutes * 0.18)),
  };
}
