"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
exports.classifyAge = classifyAge;
exports.getTopCountry = getTopCountry;
exports.normalizeName = normalizeName;
exports.getCountryName = getCountryName;
exports.fetchWithTimeout = fetchWithTimeout;
const uuid_1 = require("uuid");
function generateId() {
    return (0, uuid_1.v7)();
}
function classifyAge(age) {
    if (age >= 0 && age <= 12)
        return 'child';
    if (age >= 13 && age <= 19)
        return 'teenager';
    if (age >= 20 && age <= 59)
        return 'adult';
    return 'senior';
}
function getTopCountry(countries) {
    if (!countries || countries.length === 0)
        return null;
    return countries.reduce((prev, current) => (prev.probability > current.probability ? prev : current));
}
function normalizeName(name) {
    return name.trim().toLowerCase();
}
const COUNTRY_NAMES = {
    'NG': 'Nigeria',
    'KE': 'Kenya',
    'AO': 'Angola',
    'US': 'United States',
    'GB': 'United Kingdom',
    'CA': 'Canada',
    'ZA': 'South Africa',
    'GH': 'Ghana',
    // Add more as needed or use a library
};
function getCountryName(countryId) {
    return COUNTRY_NAMES[countryId] || countryId;
}
async function fetchWithTimeout(url, timeoutMs = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
    catch (error) {
        clearTimeout(id);
        throw error;
    }
}
