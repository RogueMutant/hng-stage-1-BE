import { Request, Response, NextFunction } from 'express';
import { ProfileService, AppError } from '../services/profile.service';

const profileService = new ProfileService();

export class ProfileController {
  async createProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
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
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  async getProfileById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const profile = await profileService.getProfileById(id);

      if (!profile) {
        res.status(404).json({ status: 'error', message: 'Profile not found' });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gender, country_id, age_group } = req.query;

      const filters: any = {};
      if (typeof gender === 'string') filters.gender = gender;
      if (typeof country_id === 'string') filters.country_id = country_id;
      if (typeof age_group === 'string') filters.age_group = age_group;

      const profiles = await profileService.getProfiles(filters);

      res.status(200).json({
        status: 'success',
        count: profiles.length,
        data: profiles,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const deleted = await profileService.deleteProfile(id);

      if (!deleted) {
        res.status(404).json({ status: 'error', message: 'Profile not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
