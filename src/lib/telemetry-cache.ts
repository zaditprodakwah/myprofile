import { supabase } from './supabase';

/**
 * Retrieves a cached telemetry value from the Supabase table `external_telemetry_cache`.
 * Returns null if the cache does not exist or is older than `maxAgeHours`.
 */
export async function getTelemetryCache(key: string, maxAgeHours: number = 6): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('external_telemetry_cache')
      .select('value, updated_at')
      .eq('key', key)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const updatedAt = new Date(data.updated_at).getTime();
    const now = Date.now();
    const ageInHours = (now - updatedAt) / (1000 * 60 * 60);

    if (ageInHours > maxAgeHours) {
      return null; // cache expired
    }

    return data.value;
  } catch (err) {
    console.error(`Error reading telemetry cache for ${key}:`, err);
    return null;
  }
}

/**
 * Saves or updates a cached telemetry value in the Supabase table `external_telemetry_cache`.
 */
export async function setTelemetryCache(key: string, value: any, source: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('external_telemetry_cache')
      .upsert({
        key,
        value,
        source,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      console.error(`Error setting telemetry cache for ${key}:`, error);
    }
  } catch (err) {
    console.error(`Error setting telemetry cache for ${key}:`, err);
  }
}
