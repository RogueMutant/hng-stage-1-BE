"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../database/prisma");
async function main() {
    console.log('Checking database...');
    try {
        const count = await prisma_1.prisma.profile.count();
        console.log('Count:', count);
        const first = await prisma_1.prisma.profile.findFirst();
        console.log('First profile:', first);
    }
    catch (e) {
        console.error('Error:', e);
    }
}
main().finally(() => {
    console.log('Disconnecting...');
    prisma_1.prisma.$disconnect();
});
