import { useCallback, useState } from 'react';

export interface GeoPoint {
  lat: number;
  lng: number;
  accuracy: number;
}

interface GeoState {
  point: GeoPoint | null;
  error: string | null;
  loading: boolean;
  supported: boolean;
}

/**
 * Subscribes to browser geolocation. We never block the UI on this —
 * the quest game falls back to a "simulated GPS" demo mode when the
 * user declines or the API is unavailable.
 */
export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    point: null,
    error: null,
    loading: false,
    supported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
  });

  const start = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState((s) => ({ ...s, error: 'Geolocation is not supported on this device.' }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    const id = navigator.geolocation.watchPosition(
      (pos) => setState((s) => ({
        ...s,
        point: { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy },
        error: null,
        loading: false,
      })),
      (err) => setState((s) => ({
        ...s,
        loading: false,
        error: err.code === err.PERMISSION_DENIED
          ? 'Location permission denied — using simulated GPS.'
          : 'Could not get location — using simulated GPS.',
      })),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  return { ...state, start };
}
