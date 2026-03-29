const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const posts = await prisma.blogPost.findMany({
        select: { id: true, title: true, published: true, scheduled_at: true }
    })
    console.log('--- BLOGS ---')
    console.log(JSON.stringify(posts, null, 2))
}

main().finally(() => prisma.$disconnect())
