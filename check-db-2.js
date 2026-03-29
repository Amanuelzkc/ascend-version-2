const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const posts = await prisma.blogPost.findMany()
    console.log('TOTAL:', posts.length)
    posts.forEach(p => {
        console.log(`ID: ${p.id} | Title: ${p.title} | Published: ${p.published} | Sched: ${p.scheduled_at} | Author: ${p.author}`)
    })
}

main().finally(() => prisma.$disconnect())
