import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

async function main() {
    
    // default customer roles
    const customerRole = await prisma.role.upsert({
        where: { name: 'CUSTOMER'},
        update: {},
        create: {
            name: 'CUSTOMER',
            description: 'Regular Customer User'
        }
    });

    const adminRole = await prisma.role.upsert({
        where: { name: "ADMIN"},
        update: {},
        create: {
            name: "ADMIN",
            description: "Adminstrator User"
        }
    });

    console.log ({ customerRole, adminRole});
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})