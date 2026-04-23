"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserService = void 0;
const GENDER_MAP = {
    male: 'male',
    males: 'male',
    female: 'female',
    females: 'female'
};
const AGE_MAP = {
    young: { min_age: 16, max_age: 24 },
    child: { age_group: 'child' },
    teenager: { age_group: 'teenager' },
    adult: { age_group: 'adult' },
    senior: { age_group: 'senior' }
};
const COUNTRY_MAP = {
    nigeria: 'NG',
    kenya: 'KE',
    angola: 'AO',
    'united states': 'US',
    'united kingdom': 'GB',
    canada: 'CA',
    'south africa': 'ZA',
    ghana: 'GH'
};
class ParserService {
    parse(query) {
        const normalized = query.toLowerCase().trim();
        if (!normalized)
            return null;
        const tokens = normalized.split(/\s+/);
        const params = {};
        let foundAny = false;
        // Direct token mapping
        for (const token of tokens) {
            if (GENDER_MAP[token]) {
                params.gender = GENDER_MAP[token];
                foundAny = true;
            }
            if (AGE_MAP[token]) {
                Object.assign(params, AGE_MAP[token]);
                foundAny = true;
            }
            if (COUNTRY_MAP[token]) {
                params.country_id = COUNTRY_MAP[token];
                foundAny = true;
            }
        }
        // Pattern matching
        const aboveMatch = normalized.match(/above\s+(\d+)/);
        if (aboveMatch) {
            params.min_age = parseInt(aboveMatch[1], 10);
            foundAny = true;
        }
        const belowMatch = normalized.match(/below\s+(\d+)/);
        if (belowMatch) {
            params.max_age = parseInt(belowMatch[1], 10);
            foundAny = true;
        }
        // Special case for "from [country]"
        const fromMatch = normalized.match(/from\s+([a-z\s]+)/);
        if (fromMatch) {
            const countryCandidate = fromMatch[1].trim();
            if (COUNTRY_MAP[countryCandidate]) {
                params.country_id = COUNTRY_MAP[countryCandidate];
                foundAny = true;
            }
        }
        return foundAny ? params : null;
    }
}
exports.ParserService = ParserService;
