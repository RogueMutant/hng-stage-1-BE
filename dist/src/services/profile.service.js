"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = exports.AppError = void 0;
const profile_repository_1 = require("../repositories/profile.repository");
const utils_1 = require("../utils");
const query_service_1 = require("./query.service");
const parser_service_1 = require("./parser.service");
class AppError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
exports.AppError = AppError;
class ProfileService {
    repository = new profile_repository_1.ProfileRepository();
    queryService = new query_service_1.QueryService();
    parserService = new parser_service_1.ParserService();
    async createProfile(inputName) {
        const name = (0, utils_1.normalizeName)(inputName);
        // Idempotency check
        const existing = await this.repository.findByName(name);
        if (existing) {
            return {
                alreadyExists: true,
                data: existing,
            };
        }
        // Call external APIs in parallel
        const [genderData, ageData, nationData] = await Promise.all([
            (0, utils_1.fetchWithTimeout)(`https://api.genderize.io?name=${encodeURIComponent(name)}`).catch(() => {
                throw new AppError(502, "Genderize returned an invalid response");
            }),
            (0, utils_1.fetchWithTimeout)(`https://api.agify.io?name=${encodeURIComponent(name)}`).catch(() => {
                throw new AppError(502, "Agify returned an invalid response");
            }),
            (0, utils_1.fetchWithTimeout)(`https://api.nationalize.io?name=${encodeURIComponent(name)}`).catch(() => {
                throw new AppError(502, "Nationalize returned an invalid response");
            }),
        ]);
        // Validate Genderize
        if (genderData.gender === null || genderData.count === 0) {
            throw new AppError(502, "Genderize returned an invalid response");
        }
        // Validate Agify
        if (ageData.age === null) {
            throw new AppError(502, "Agify returned an invalid response");
        }
        // Validate Nationalize
        if (!nationData.country || nationData.country.length === 0) {
            throw new AppError(502, "Nationalize returned an invalid response");
        }
        const topCountry = (0, utils_1.getTopCountry)(nationData.country);
        if (!topCountry) {
            throw new AppError(502, "Nationalize returned an invalid response");
        }
        const age = ageData.age;
        const ageGroup = (0, utils_1.classifyAge)(age);
        const newProfileData = {
            id: (0, utils_1.generateId)(),
            name,
            gender: genderData.gender,
            gender_probability: genderData.probability,
            age,
            age_group: ageGroup,
            country_id: topCountry.country_id,
            country_name: (0, utils_1.getCountryName)(topCountry.country_id),
            country_probability: topCountry.probability,
            created_at: new Date(),
        };
        const newProfile = await this.repository.create(newProfileData);
        return {
            alreadyExists: false,
            data: newProfile,
        };
    }
    async getProfileById(id) {
        return this.repository.findById(id);
    }
    async getProfiles(queryParams) {
        try {
            const params = this.queryService.validateParams(queryParams);
            const prismaQuery = this.queryService.buildPrismaQuery(params);
            const [profiles, total] = await Promise.all([
                this.repository.findAll(prismaQuery),
                this.repository.countAll(prismaQuery.where || {})
            ]);
            return {
                profiles,
                total,
                page: params.page,
                limit: params.limit
            };
        }
        catch (error) {
            if (error.message === 'INVALID_KEY') {
                throw new AppError(400, 'Invalid query parameters');
            }
            if (error.message === 'INVALID_TYPE') {
                throw new AppError(422, 'Invalid parameter types');
            }
            throw error;
        }
    }
    async searchProfiles(query) {
        const filters = this.parserService.parse(query);
        if (!filters) {
            throw new AppError(400, 'Unable to interpret query');
        }
        return this.getProfiles(filters);
    }
    async deleteProfile(id) {
        const profile = await this.repository.findById(id);
        if (!profile) {
            return false;
        }
        await this.repository.deleteById(id);
        return true;
    }
}
exports.ProfileService = ProfileService;
