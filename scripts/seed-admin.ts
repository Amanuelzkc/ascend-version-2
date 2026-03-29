const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")

const prisma = new PrismaClient()

async function main() {
  const username = process.env.ADMIN_INITIAL_USERNAME || "admin"
  const password = process.env.ADMIN_INITIAL_PASSWORD || "password123"
  const name = "Superadmin A"

  const hashedPassword = await bcrypt.hash(password, 10)

  console.log(`Seeding Superadmin A: ${username}...`)

  const user = await prisma.user.upsert({
    where: { username },
    update: {
      password: hashedPassword,
      role: "SUPERADMIN",
      name: name,
    },
    create: {
      username,
      password: hashedPassword,
      role: "SUPERADMIN",
      name: name,
    },
  })

  console.log("Success! Superadmin A created/updated.")
  console.log(`ID: ${user.id}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

export {}
