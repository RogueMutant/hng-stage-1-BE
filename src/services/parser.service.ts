export interface ParsedFilters {
  gender?: string;
  age_group?: string;
  country_id?: string;
  min_age?: number;
  max_age?: number;
}

export class ParserService {
  private genderMap: Record<string, string> = {
    male: 'male',
    males: 'male',
    female: 'female',
    females: 'female',
  };

  private ageGroupKeywords: Record<string, string> = {
    child: 'child',
    teenager: 'teenager',
    adult: 'adult',
    senior: 'senior',
  };

  private countryMap: Record<string, string> = {
    nigeria: 'NG',
    kenya: 'KE',
    angola: 'AO',
    'united states': 'US',
    'united kingdom': 'GB',
    france: 'FR',
    germany: 'DE',
    india: 'IN',
    china: 'CN',
    japan: 'JP',
    brazil: 'BR',
    'south africa': 'ZA',
    ghana: 'GH',
    egypt: 'EG',
    canada: 'CA',
    australia: 'AU'
  };

  parse(query: string): ParsedFilters {
    const filters: ParsedFilters = {};
    const normalized = query.toLowerCase().trim();
    const tokens = normalized.split(/\s+/);

    // Keyword mapping
    for (const token of tokens) {
      if (this.genderMap[token]) {
        filters.gender = this.genderMap[token];
      }
      if (this.ageGroupKeywords[token]) {
        filters.age_group = this.ageGroupKeywords[token];
      }
      if (token === 'young') {
        filters.min_age = 16;
        filters.max_age = 24;
      }
      if (this.countryMap[token]) {
        filters.country_id = this.countryMap[token];
      }
    }

    // Handle multi-word countries or phrases
    for (const [name, code] of Object.entries(this.countryMap)) {
      if (normalized.includes(name)) {
        filters.country_id = code;
      }
    }

    // Numeric patterns
    const aboveMatch = normalized.match(/above\s+(\d+)/);
    if (aboveMatch) {
      filters.min_age = parseInt(aboveMatch[1], 10);
    }

    const belowMatch = normalized.match(/below\s+(\d+)/);
    if (belowMatch) {
      filters.max_age = parseInt(belowMatch[1], 10);
    }

    const overMatch = normalized.match(/over\s+(\d+)/);
    if (overMatch) {
        filters.min_age = parseInt(overMatch[1], 10);
    }

    const underMatch = normalized.match(/under\s+(\d+)/);
    if (underMatch) {
        filters.max_age = parseInt(underMatch[1], 10);
    }

    return filters;
  }
}
