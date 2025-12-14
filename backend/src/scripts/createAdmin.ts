import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import readline from 'readline';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function createAdmin() {
  try {
    console.log('Creating admin user...\n');

    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User with this email already exists.');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    console.log('\nAdmin user created successfully!');
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();

