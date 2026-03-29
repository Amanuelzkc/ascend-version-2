import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const total = await prisma.blogpost.count()
    const publishedCount = await prisma.blogpost.count({ where: { published: true } })
    const scheduledCount = await prisma.blogpost.count({ where: { NOT: { scheduled_at: null } } })
    const posts = await prisma.blogpost.findMany({ take: 5, select: { id: true, title: true, published: true, scheduled_at: true } })

    console.log('Total posts:', total)
    console.log('Published posts:', publishedCount)
    console.log('Scheduled posts:', scheduledCount)
    console.log('Sample posts:', JSON.stringify(posts, null, 2))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
