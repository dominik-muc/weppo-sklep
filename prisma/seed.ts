import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'securepassword';
  
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
    data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "Admin",
        role: "admin",
    },
    });

    await prisma.product.createMany({
        data: [
            {
                name: "Rzecz 1",
                price: 3999.99,
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            },
            {
                name: "Rzecz 2",
                price: 2499.59,
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
            },
            {
                name: "Rzecz 3",
                price: 499.99,
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
            },
            {
                name: "Rzecz 4",
                price: 1269.50,
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
            },
            {
                name: "Rzecz 5",
                price: 129.99,
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
            },
        ],
    });
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
