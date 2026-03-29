import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.blogpost.update({
        where: { id: 7 },
        data: { 
            slug: 'amharic-test-post-fixed',
            updatedAt: new Date()
        }
    });
    console.log('Updated post 7');
}

main().finally(() => prisma.$disconnect());
