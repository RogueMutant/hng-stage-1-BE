import { ProfileRepository } from "../repositories/profile.repository";
import {
  classifyAge,
  fetchWithTimeout,
  generateId,
  getTopCountry,
  normalizeName,
} from "../utils";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ProfileService {
  private repository = new ProfileRepository();

  async createProfile(inputName: string) {
    const name = normalizeName(inputName);

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
      fetchWithTimeout<any>(
        `https://api.genderize.io?name=${encodeURIComponent(name)}`,
      ).catch(() => {
        throw new AppError(502, "Genderize returned an invalid response");
      }),
      fetchWithTimeout<any>(
        `https://api.agify.io?name=${encodeURIComponent(name)}`,
      ).catch(() => {
        throw new AppError(502, "Agify returned an invalid response");
      }),
      fetchWithTimeout<any>(
        `https://api.nationalize.io?name=${encodeURIComponent(name)}`,
      ).catch(() => {
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

    const topCountry = getTopCountry(nationData.country);
    if (!topCountry) {
      throw new AppError(502, "Nationalize returned an invalid response");
    }

    const age = ageData.age;
    const ageGroup = classifyAge(age);

    const newProfileData = {
      id: generateId(),
      name,
      gender: genderData.gender,
      gender_probability: genderData.probability,
      sample_size: genderData.count,
      age,
      age_group: ageGroup,
      country_id: topCountry.country_id,
      country_probability: topCountry.probability,
      created_at: new Date(), // Prisma handles to Date object
    };

    const newProfile = await this.repository.create(newProfileData);

    return {
      alreadyExists: false,
      data: newProfile,
    };
  }

  async getProfileById(id: string) {
    return this.repository.findById(id);
  }

  async getProfiles(filters: {
    gender?: string;
    country_id?: string;
    age_group?: string;
  }) {
    // case insensitive formatting
    const formattedFilters = {
      gender: filters.gender ? filters.gender.toLowerCase() : undefined,
      country_id: filters.country_id
        ? filters.country_id.toUpperCase()
        : undefined,
      age_group: filters.age_group
        ? filters.age_group.toLowerCase()
        : undefined,
    };

    return this.repository.findAll(formattedFilters);
  }

  async deleteProfile(id: string) {
    const profile = await this.repository.findById(id);
    if (!profile) {
      return false;
    }
    await this.repository.deleteById(id);
    return true;
  }
}
