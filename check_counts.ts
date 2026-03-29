import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const blogs = await prisma.blogpost.count()
  const insights = await prisma.insight.count()
  const jobs = await prisma.job.count()
  const users = await prisma.user.findMany()

  console.log('Database Status:')
  console.log(`Blogs: ${blogs}`)
  console.log(`Insights: ${insights}`)
  console.log(`Jobs: ${jobs}`)
  console.log('Users:', users.map(u => ({ username: u.username, role: u.role })))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
