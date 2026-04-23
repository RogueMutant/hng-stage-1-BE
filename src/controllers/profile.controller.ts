import { Request, Response, NextFunction } from 'express';
import { ProfileService, AppError } from '../services/profile.service';
import { QueryService } from '../services/query.service';

const profileService = new ProfileService();
const queryService = new QueryService();

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
      const validation = queryService.validateQueryParams(req.query);
      if (!validation.valid) {
        res.status(400).json({ status: 'error', message: validation.message });
        return;
      }

      const options = {
        gender: req.query.gender as string,
        age_group: req.query.age_group as string,
        country_id: req.query.country_id as string,
        min_age: req.query.min_age ? Number(req.query.min_age) : undefined,
        max_age: req.query.max_age ? Number(req.query.max_age) : undefined,
        min_gender_probability: req.query.min_gender_probability ? Number(req.query.min_gender_probability) : undefined,
        min_country_probability: req.query.min_country_probability ? Number(req.query.min_country_probability) : undefined,
        sort_by: req.query.sort_by as string,
        order: req.query.order as string,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      };

      const result = await queryService.getProfiles(options);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchProfiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, page, limit } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({ status: 'error', message: 'Missing search query' });
        return;
      }

      const pageNum = page ? Number(page) : 1;
      const limitNum = limit ? Number(limit) : 10;

      const result = await queryService.searchProfiles(q, pageNum, limitNum);
      
      if (result.status === 'error') {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
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
