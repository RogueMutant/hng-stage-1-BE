import { v7 as uuidv7 } from 'uuid';

export function generateId(): string {
  return uuidv7();
}

export function classifyAge(age: number): string {
  if (age >= 0 && age <= 12) return 'child';
  if (age >= 13 && age <= 19) return 'teenager';
  if (age >= 20 && age <= 59) return 'adult';
  return 'senior';
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
