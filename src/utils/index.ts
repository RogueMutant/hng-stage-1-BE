import { v7 as uuidv7 } from 'uuid';

export function generateId(): string {
  return uuidv7();
}

export const countryMap: Record<string, string> = {
  'NG': 'Nigeria',
  'KE': 'Kenya',
  'AO': 'Angola',
  'US': 'United States',
  'GB': 'United Kingdom',
  'FR': 'France',
  'DE': 'Germany',
  'IN': 'India',
  'CN': 'China',
  'JP': 'Japan',
  'BR': 'Brazil',
  'ZA': 'South Africa',
  'GH': 'Ghana',
  'EG': 'Egypt',
  'CA': 'Canada',
  'AU': 'Australia'
};

export function getCountryName(code: string): string {
  return countryMap[code.toUpperCase()] || 'Unknown';
}

export function classifyAge(age: number): string {
  if (age >= 0 && age <= 12) return 'child';
  if (age >= 13 && age <= 19) return 'teenager';
  if (age >= 20 && age <= 59) return 'adult';
  if (age >= 60) return 'senior';
  return 'unknown';
}

export function getTopCountry(countries: Array<{ country_id: string; probability: number }>): { country_id: string; probability: number } | null {
  if (!countries || countries.length === 0) return null;
  return countries.reduce((prev, current) => (prev.probability > current.probability ? prev : current));
}

export function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export async function fetchWithTimeout<T>(url: string, timeoutMs: number = 5000): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json() as T;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}
