import express from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient()
const router = express.Router();

router.get("/users", (req, res) => {
    res.send("dominik i kaja");
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

export default router;
