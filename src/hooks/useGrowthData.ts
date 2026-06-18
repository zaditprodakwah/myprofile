import { useReducer, useEffect } from 'react';

type State = {
  currentRevenue: number;
  projectedRevenue: number;
  growthPercentage: number;
};

type Action =
  | { type: 'SET_CURRENT'; payload: number }
  | { type: 'SET_PROJECTED'; payload: number }
  | { type: 'SET_GROWTH'; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CURRENT':
      return { ...state, currentRevenue: action.payload };
    case 'SET_PROJECTED':
      return { ...state, projectedRevenue: action.payload };
    case 'SET_GROWTH':
      return { ...state, growthPercentage: action.payload };
    default:
      return state;
  }
}

/**
 * Calculates growth metrics based on traffic, conversion rate, and average order value.
 * Returns currentRevenue, projectedRevenue, and growthPercentage.
 */
export function useGrowthData(params: {
  traffic: number;
  conversionRate: number;
  avgOrderValue: number;
  TRAFFIC_MULTIPLIER?: number;
  CR_MULTIPLIER?: number;
}) {
  const {
    traffic,
    conversionRate,
    avgOrderValue,
    TRAFFIC_MULTIPLIER = 1.4,
    CR_MULTIPLIER = 1.3,
  } = params;

  const [state, dispatch] = useReducer(reducer, {
    currentRevenue: 0,
    projectedRevenue: 0,
    growthPercentage: 0,
  });

  useEffect(() => {
    // Current calculations
    const currentOrders = traffic * (conversionRate / 100);
    const currentRev = currentOrders * avgOrderValue;
    dispatch({ type: 'SET_CURRENT', payload: currentRev });

    // Projected calculations
    const projectedTraffic = traffic * TRAFFIC_MULTIPLIER;
    const projectedCr = conversionRate * CR_MULTIPLIER;
    const projectedOrders = projectedTraffic * (projectedCr / 100);
    const projectedRev = projectedOrders * avgOrderValue;
    dispatch({ type: 'SET_PROJECTED', payload: projectedRev });

    // Growth percentage
    const growth = currentRev > 0 ? ((projectedRev - currentRev) / currentRev) * 100 : 0;
    dispatch({ type: 'SET_GROWTH', payload: growth });
  }, [traffic, conversionRate, avgOrderValue, TRAFFIC_MULTIPLIER, CR_MULTIPLIER]);

  return {
    currentRevenue: state.currentRevenue,
    projectedRevenue: state.projectedRevenue,
    growthPercentage: state.growthPercentage,
  };
}
