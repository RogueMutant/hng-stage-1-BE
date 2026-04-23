"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryService = void 0;
class QueryService {
    allowedSortFields = ['age', 'created_at', 'gender_probability'];
    allowedOrderValues = ['asc', 'desc'];
    allowedKeys = [
        'gender', 'age_group', 'country_id', 'min_age', 'max_age',
        'min_gender_probability', 'min_country_probability',
        'sort_by', 'order', 'page', 'limit'
    ];
    validateParams(query) {
        // Check for invalid keys
        const keys = Object.keys(query);
        for (const key of keys) {
            if (!this.allowedKeys.includes(key)) {
                throw new Error('INVALID_KEY');
            }
        }
        const params = {};
        // Helper for numeric conversion and validation
        const getNum = (val, key) => {
            if (val === undefined)
                return undefined;
            const num = Number(val);
            if (isNaN(num))
                throw new Error('INVALID_TYPE');
            return num;
        };
        params.gender = query.gender;
        params.age_group = query.age_group;
        params.country_id = query.country_id;
        params.min_age = getNum(query.min_age, 'min_age');
        params.max_age = getNum(query.max_age, 'max_age');
        params.min_gender_probability = getNum(query.min_gender_probability, 'min_gender_probability');
        params.min_country_probability = getNum(query.min_country_probability, 'min_country_probability');
        params.sort_by = query.sort_by;
        if (params.sort_by && !this.allowedSortFields.includes(params.sort_by)) {
            throw new Error('INVALID_TYPE');
        }
        params.order = query.order;
        if (params.order && !this.allowedOrderValues.includes(params.order)) {
            throw new Error('INVALID_TYPE');
        }
        params.page = getNum(query.page, 'page') || 1;
        params.limit = getNum(query.limit, 'limit') || 10;
        if (params.limit > 50)
            params.limit = 50;
        if (params.limit < 1)
            params.limit = 10;
        if (params.page < 1)
            params.page = 1;
        return params;
    }
    buildPrismaQuery(params) {
        const where = { AND: [] };
        const and = where.AND;
        if (params.gender) {
            and.push({ gender: { equals: params.gender.toLowerCase() } });
        }
        if (params.age_group) {
            and.push({ age_group: { equals: params.age_group.toLowerCase() } });
        }
        if (params.country_id) {
            and.push({ country_id: { equals: params.country_id.toUpperCase() } });
        }
        if (params.min_age !== undefined) {
            and.push({ age: { gte: params.min_age } });
        }
        if (params.max_age !== undefined) {
            and.push({ age: { lte: params.max_age } });
        }
        if (params.min_gender_probability !== undefined) {
            and.push({ gender_probability: { gte: params.min_gender_probability } });
        }
        if (params.min_country_probability !== undefined) {
            and.push({ country_probability: { gte: params.min_country_probability } });
        }
        const orderBy = {};
        if (params.sort_by) {
            orderBy[params.sort_by] = params.order || 'desc';
        }
        else {
            orderBy.created_at = 'desc';
        }
        const take = params.limit || 10;
        const skip = ((params.page || 1) - 1) * take;
        return { where, orderBy, take, skip };
    }
}
exports.QueryService = QueryService;
