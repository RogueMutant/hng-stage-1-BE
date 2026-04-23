import { Prisma } from '@prisma/client';
import { prisma } from '../database/prisma';

export class ProfileRepository {
  async create(data: Prisma.ProfileCreateInput) {
    return prisma.profile.create({
      data,
    });
  }

  async findByName(name: string) {
    // Perform case-insensitive search
    return prisma.profile.findFirst({
      where: {
        name: {
          equals: name,
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.profile.findUnique({
      where: { id },
    });
  }

  async findAll(options: {
    filters: {
      gender?: string;
      age_group?: string;
      country_id?: string;
      min_age?: number;
      max_age?: number;
      min_gender_probability?: number;
      min_country_probability?: number;
    };
    sort?: {
      by: 'age' | 'created_at' | 'gender_probability';
      order: 'asc' | 'desc';
    };
    pagination: {
      page: number;
      limit: number;
    };
  }) {
    const { filters, sort, pagination } = options;
    const where: Prisma.ProfileWhereInput = {};

    if (filters.gender) where.gender = { equals: filters.gender };
    if (filters.age_group) where.age_group = { equals: filters.age_group };
    if (filters.country_id) where.country_id = { equals: filters.country_id };
    
    if (filters.min_age !== undefined || filters.max_age !== undefined) {
      where.age = {};
      if (filters.min_age !== undefined) where.age.gte = filters.min_age;
      if (filters.max_age !== undefined) where.age.lte = filters.max_age;
    }

    if (filters.min_gender_probability !== undefined) {
      where.gender_probability = { gte: filters.min_gender_probability };
    }

    if (filters.min_country_probability !== undefined) {
      where.country_probability = { gte: filters.min_country_probability };
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;

    const [data, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        orderBy: sort ? { [sort.by]: sort.order } : undefined,
        skip,
        take,
      }),
      prisma.profile.count({ where }),
    ]);

    return { data, total };
  }

  async deleteById(id: string) {
    return prisma.profile.delete({
      where: { id },
    });
  }
}
