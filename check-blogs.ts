import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const allPosts = await prisma.blogpost.count()
        const publishedPosts = await prisma.blogpost.findMany({
            where: {
                OR: [
                    { published: true },
                    { scheduled_at: { lte: new Date() } }
                ]
            }
        })

        console.log('--- DB SUMMARY ---')
        console.log('Total blogs in DB:', allPosts)
        console.log('Blogs visible by query:', publishedPosts.length)
        if (publishedPosts.length > 0) {
            console.log('First visible blog title:', publishedPosts[0].title)
        }
        console.log('--- END SUMMARY ---')
    } catch (err) {
        console.error('DB Check failed:', err)
    } finally {
        await prisma.$disconnect()
    }
}

main()
