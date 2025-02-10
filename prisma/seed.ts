import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.product.createMany({
        data: [
            {
                name: "Laptop",
                price: 3999.99,
                description: "Wydajny laptop do pracy i gier",
            },
            {
                name: "Smartphone",
                price: 2499.50,
                description: "Nowoczesny smartfon z doskonałym aparatem",
            },
        ],
    });
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
