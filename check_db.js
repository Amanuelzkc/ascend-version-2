const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const count = await prisma.insight.count()
    console.log('Total insights:', count)
    const all = await prisma.insight.findMany()
    console.log('Insights:', JSON.stringify(all, null, 2))
    await prisma.$disconnect()
}

main().catch(console.error)
