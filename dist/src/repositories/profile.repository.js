"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRepository = void 0;
const prisma_1 = require("../database/prisma");
class ProfileRepository {
    async create(data) {
        return prisma_1.prisma.profile.create({
            data,
        });
    }
    async findByName(name) {
        // Perform case-insensitive search
        return prisma_1.prisma.profile.findFirst({
            where: {
                name: {
                    equals: name,
                },
            },
        });
    }
    async findById(id) {
        return prisma_1.prisma.profile.findUnique({
            where: { id },
        });
    }
    async findAll(args) {
        return prisma_1.prisma.profile.findMany(args);
    }
    async countAll(where) {
        return prisma_1.prisma.profile.count({
            where,
        });
    }
    async deleteById(id) {
        return prisma_1.prisma.profile.delete({
            where: { id },
        });
    }
}
exports.ProfileRepository = ProfileRepository;
