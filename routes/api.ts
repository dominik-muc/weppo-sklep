import express from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/logout", (req, res) => {
    res.cookie('user', '', { maxAge: -1 });
    res.redirect('/');
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('login', { message: "Nieprawidłowy e-mail lub hasło" });
        }

        res.cookie("user", email, { signed: true });


        res.redirect('/');
    } catch (error) {
        res.render('login', { message: "Wystąpił błąd. Spróbuj ponownie." });
    }
});

router.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.render('register', { message: "Wszystkie pola są wymagane!" });
    }

    if (password !== confirmPassword) {
        return res.render('register', { message: "Hasła nie są takie same!" });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.render('register', { message: "Ten email jest już zajęty" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
            },
        });
        
        res.redirect('/login');
    } catch(error) {
        res.render('register', { message: "Wystąpił błąd. Spróbuj ponownie." });
    }
});

router.post("/add", async (req, res) => {
    const { productId } = req.body;
    const userEmail = req.signedCookies.user;

    if (!userEmail) {
        return res.redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: userEmail },
    });

    if (!user) {
        return res.redirect("/login");
    }

    let cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: { items: true },
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId: user.id,
            },
            include: { items: true },
        });
    }

    const existingItem = cart.items.find(item => item.productId === parseInt(productId));

    if (existingItem) {
        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + 1 },
        });
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: parseInt(productId),
                quantity: 1,
            },
        });
    }

    res.redirect("/cart");
});

router.post("/remove", async (req, res) => {
    const { cartItemId } = req.body;

    const cartItem = await prisma.cartItem.findUnique({
        where: { id: parseInt(cartItemId) },
    });

    if (!cartItem) {
        return res.redirect("/cart");
    }

    if (cartItem.quantity > 1) {
        await prisma.cartItem.update({
            where: { id: cartItem.id },
            data: { quantity: cartItem.quantity - 1 },
        });
    } else {
        await prisma.cartItem.delete({
            where: { id: cartItem.id },
        });
    }

    res.redirect("/cart");
});


export default router;
