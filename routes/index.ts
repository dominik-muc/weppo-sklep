import express from "express";
import { PrismaClient } from "@prisma/client";
import { isQualifiedName } from "typescript";

const prisma = new PrismaClient();
const router = express.Router();

router.use("/favicon.ico", express.static("public/icons/favicon.ico"));
router.use("/site.webmanifest", express.static("public/site.webmanifest"));

router.get("/login", (req, res) => {
    if (req.signedCookies.user) {
        return res.redirect("/");
    }
    res.render("login");
});

router.get("/register", (req, res) => {
    if (req.signedCookies.user) {
        return res.redirect("/");
    }
    res.render("register");
});

router.get("/cart", async (req, res) => {
    const userEmail = req.signedCookies.user;

    if (!userEmail) {
        return res.redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: { cart: { include: { items: { include: { product: true } } } } },
    });

    if (!user || !user.cart) {
        return res.render("cart", { cart: [], totalPrice: 0, shippingCost: 0, finalTotal: 0 });
    }

    const cartItems = user.cart.items.map(item => ({
        id: item.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
    }));

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = 10;
    const finalTotal = totalPrice + shippingCost;

    res.render("cart", { cart: cartItems, totalPrice, shippingCost, finalTotal });
});

router.get("/order-success", (_, res) => {
    res.render("order-success");
});

router.get("/", async (req, res) => {
    const products = await prisma.product.findMany();

    res.render("index", {
    title: "Strona główna",
    products,
    });
});

export default router;
