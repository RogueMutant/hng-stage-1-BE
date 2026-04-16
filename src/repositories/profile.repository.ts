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

  async findAll(filters: { gender?: string; country_id?: string; age_group?: string }) {
    const where: Prisma.ProfileWhereInput = {};

    if (filters.gender) {
      where.gender = { equals: filters.gender };
    }
    if (filters.country_id) {
      where.country_id = { equals: filters.country_id };
    }
    if (filters.age_group) {
      where.age_group = { equals: filters.age_group };
    }

    return prisma.profile.findMany({
      where,
    });
  }

  async deleteById(id: string) {
    return prisma.profile.delete({
      where: { id },
    });
  }
}
