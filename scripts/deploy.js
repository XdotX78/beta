const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Ensure database connection
        await prisma.$connect();
        console.log('✅ Database connection successful');

        // Add any production seed data here if needed
        // For example, creating an admin user:
        /*
        await prisma.user.upsert({
          where: { email: 'admin@example.com' },
          update: {},
          create: {
            email: 'admin@example.com',
            password: 'HASHED_PASSWORD', // Remember to hash the password
            name: 'Admin',
            role: 'ADMIN',
            isVerified: true
          }
        });
        */

        console.log('✅ Deployment script completed successfully');
    } catch (error) {
        console.error('❌ Error during deployment:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main(); 