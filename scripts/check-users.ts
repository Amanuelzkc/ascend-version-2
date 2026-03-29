const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking database for users...');
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users in database.`);
  users.forEach((u: any) => {
    console.log(`- ID: ${u.id}, Username: ${u.username}, Role: ${u.role}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

export {}
