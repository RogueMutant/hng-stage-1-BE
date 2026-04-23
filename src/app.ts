import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ProfileController } from './controllers/profile.controller';

const app = express();

// Middleware
app.use(express.json());

// Add mandatory CORS header
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const profileController = new ProfileController();

// Routes
app.post('/api/profiles', profileController.createProfile.bind(profileController));
app.get('/api/profiles/search', profileController.searchProfiles.bind(profileController));
app.get('/api/profiles/:id', profileController.getProfileById.bind(profileController));
app.get('/api/profiles', profileController.getProfiles.bind(profileController));
app.delete('/api/profiles/:id', profileController.deleteProfile.bind(profileController));

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ status: 'error', message: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

export default app;
