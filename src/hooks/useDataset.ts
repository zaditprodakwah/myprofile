import { useReducer, useEffect } from 'react';
import type { ExplorerDataset } from '@/app/sovereign-explorer/page';

type State<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

type Action<T> =
  | { type: 'START' }
  | { type: 'SUCCESS'; payload: T }
  | { type: 'FAIL'; error: string };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'START':
      return { ...state, isLoading: true, error: null };
    case 'SUCCESS':
      return { data: action.payload, isLoading: false, error: null };
    case 'FAIL':
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}

const cache = new Map<ExplorerDataset, unknown>();

export function useDataset<T = unknown>(dataset: ExplorerDataset) {
  const [state, dispatch] = useReducer(reducer<T>, {
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchDataset = async () => {
    dispatch({ type: 'START' });
    try {
      if (cache.has(dataset)) {
        dispatch({ type: 'SUCCESS', payload: cache.get(dataset) as T });
        return;
      }
      let endpoint = '';
      switch (dataset) {
        case 'BPS_MACRO':
          endpoint = '/api/sovereign/macro-economics';
          break;
        case 'FRED_INTEREST':
          endpoint = '/api/sovereign/fred';
          break;
        case 'POLYGON_MARKETS':
          endpoint = '/api/sovereign/markets';
          break;
        case 'DATARAKYAT':
          endpoint = '/api/sovereign/datarakyat';
          break;
        default:
          break;
      }
      const res = await fetch(endpoint);
      const json = await res.json();
      if (json.success) {
        cache.set(dataset, json.data);
        dispatch({ type: 'SUCCESS', payload: json.data as T });
      } else {
        dispatch({ type: 'FAIL', error: 'Failed to fetch data' });
      }
    } catch (_err) {
      dispatch({ type: 'FAIL', error: 'Network Error' });
    }
  };

  useEffect(() => {
    fetchDataset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset]);

  const refetch = () => {
    cache.delete(dataset);
    fetchDataset();
  };

  return { ...state, refetch };
}
