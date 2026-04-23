"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const profile_controller_1 = require("./controllers/profile.controller");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Add mandatory CORS header
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
const profileController = new profile_controller_1.ProfileController();
// Routes
app.post('/api/profiles', profileController.createProfile.bind(profileController));
app.get('/api/profiles/search', profileController.searchProfiles.bind(profileController));
app.get('/api/profiles/:id', profileController.getProfileById.bind(profileController));
app.get('/api/profiles', profileController.getProfiles.bind(profileController));
app.delete('/api/profiles/:id', profileController.deleteProfile.bind(profileController));
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'Endpoint not found' });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});
exports.default = app;
