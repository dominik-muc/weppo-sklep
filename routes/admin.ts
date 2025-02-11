import express from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
    const userEmail = req.signedCookies.user;

    if (!userEmail) {
        return res.redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: userEmail },
    });

    if (!user || user.role !== "admin") {
        return res.redirect("/");
    }

    res.render("admin");
});

router.get("/users", async (req, res) => {
    const users = await prisma.user.findMany({
        select: { email: true, firstName: true, lastName: true, role: true },
    });

    res.render("admin_users", { users });
});

router.get("/transactions", async (req, res) => {
    const transactions = await prisma.transaction.findMany({
        include: {
            items: { include: { product: true } },
            user: { select: { email: true } },
        },
    });

    res.render("admin_transactions", { transactions });
});

router.get("/products", async (req, res) => {
    const products = await prisma.product.findMany();

    res.render("admin_products", { products });
});

router.post("/products/delete", async (req, res) => {
    const { productId } = req.body;

    await prisma.product.delete({
        where: { id: parseInt(productId) }
    });

    res.redirect("/admin/products");
});

export default router;