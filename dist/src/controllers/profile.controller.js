"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const profile_service_1 = require("../services/profile.service");
const profileService = new profile_service_1.ProfileService();
class ProfileController {
    async createProfile(req, res, next) {
        try {
            const { name } = req.body;
            if (name === undefined || name === null || typeof name !== 'string' || name.trim() === '') {
                if (name === undefined || name === null || (typeof name === 'string' && name.trim() === '')) {
                    res.status(400).json({ status: 'error', message: 'Missing or empty name' });
                    return;
                }
                res.status(422).json({ status: 'error', message: 'Invalid type for name' });
                return;
            }
            const result = await profileService.createProfile(name);
            if (result.alreadyExists) {
                res.status(200).json({
                    status: 'success',
                    message: 'Profile already exists',
                    data: result.data,
                });
                return;
            }
            res.status(201).json({
                status: 'success',
                data: result.data,
            });
        }
        catch (error) {
            if (error instanceof profile_service_1.AppError) {
                res.status(error.statusCode).json({
                    status: 'error',
                    message: error.message,
                });
                return;
            }
            next(error);
        }
    }
    async getProfileById(req, res, next) {
        try {
            const id = req.params.id;
            const profile = await profileService.getProfileById(id);
            if (!profile) {
                res.status(404).json({ status: 'error', message: 'Profile not found' });
                return;
            }
            res.status(200).json({
                status: 'success',
                data: profile,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getProfiles(req, res, next) {
        try {
            const result = await profileService.getProfiles(req.query);
            res.status(200).json({
                status: 'success',
                page: result.page,
                limit: result.limit,
                total: result.total,
                data: result.profiles,
            });
        }
        catch (error) {
            if (error instanceof profile_service_1.AppError) {
                res.status(error.statusCode).json({
                    status: 'error',
                    message: error.message,
                });
                return;
            }
            next(error);
        }
    }
    async searchProfiles(req, res, next) {
        try {
            const q = req.query.q;
            if (typeof q !== 'string') {
                res.status(400).json({ status: 'error', message: 'Missing search query' });
                return;
            }
            const result = await profileService.searchProfiles(q);
            res.status(200).json({
                status: 'success',
                page: result.page,
                limit: result.limit,
                total: result.total,
                data: result.profiles,
            });
        }
        catch (error) {
            if (error instanceof profile_service_1.AppError) {
                res.status(error.statusCode).json({
                    status: 'error',
                    message: error.message,
                });
                return;
            }
            next(error);
        }
    }
    async deleteProfile(req, res, next) {
        try {
            const id = req.params.id;
            const deleted = await profileService.deleteProfile(id);
            if (!deleted) {
                res.status(404).json({ status: 'error', message: 'Profile not found' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProfileController = ProfileController;
