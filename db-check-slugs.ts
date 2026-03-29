import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.blogpost.findMany({
        select: { id: true, title: true, slug: true, published: true }
    });
    console.log(JSON.stringify(posts, null, 2));
}

main().finally(() => prisma.$disconnect());
