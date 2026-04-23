import { ParserService, ParsedFilters } from './parser.service';
import { ProfileService } from './profile.service';

export interface QueryOptions {
  gender?: string;
  age_group?: string;
  country_id?: string;
  min_age?: number;
  max_age?: number;
  min_gender_probability?: number;
  min_country_probability?: number;
  sort_by?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export class QueryService {
  private parserService = new ParserService();
  private profileService = new ProfileService();

  async getProfiles(options: QueryOptions) {
    const filters = {
      gender: options.gender,
      age_group: options.age_group,
      country_id: options.country_id,
      min_age: options.min_age,
      max_age: options.max_age,
      min_gender_probability: options.min_gender_probability,
      min_country_probability: options.min_country_probability,
    };

    const sort = {
      by: (options.sort_by as any) || 'created_at',
      order: (options.order as any) || 'desc',
    };

    const pagination = {
      page: options.page || 1,
      limit: options.limit || 10,
    };

    // Validate page/limit
    if (pagination.page < 1) pagination.page = 1;
    if (pagination.limit < 1) pagination.limit = 10;
    if (pagination.limit > 50) pagination.limit = 50;

    const result = await this.profileService.getProfiles({
      filters,
      sort,
      pagination,
    });

    return {
      status: 'success',
      page: pagination.page,
      limit: pagination.limit,
      total: result.total,
      data: result.data,
    };
  }

  async searchProfiles(query: string, page: number = 1, limit: number = 10) {
    const filters = this.parserService.parse(query);
    
    if (Object.keys(filters).length === 0) {
      return {
        status: 'error',
        message: 'Unable to interpret query',
      };
    }

    return this.getProfiles({
      ...filters,
      page,
      limit,
    });
  }

  validateQueryParams(query: any): { valid: boolean; message?: string } {
    const allowedKeys = [
      'gender', 'age_group', 'country_id', 'min_age', 'max_age',
      'min_gender_probability', 'min_country_probability',
      'sort_by', 'order', 'page', 'limit'
    ];

    for (const key of Object.keys(query)) {
      if (!allowedKeys.includes(key)) {
        return { valid: false, message: `Invalid query parameter: ${key}` };
      }
    }

    // Type validation
    const numericFields = [
      'min_age', 'max_age', 'min_gender_probability', 
      'min_country_probability', 'page', 'limit'
    ];

    for (const field of numericFields) {
      if (query[field] !== undefined && isNaN(Number(query[field]))) {
        return { valid: false, message: `Invalid type for ${field}` };
      }
    }

    const allowedSortFields = ['age', 'created_at', 'gender_probability'];
    if (query.sort_by && !allowedSortFields.includes(query.sort_by)) {
      return { valid: false, message: 'Invalid sort_by field' };
    }

    const allowedOrders = ['asc', 'desc'];
    if (query.order && !allowedOrders.includes(query.order)) {
      return { valid: false, message: 'Invalid order' };
    }

    return { valid: true };
  }
}
