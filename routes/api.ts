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

        if (!user) {
            res.send({ error: "Nieprawidłowy e-mail lub hasło"});
        }
        else {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.send({ error: "Nieprawidłowy e-mail lub hasło"});
            }

            res.send({ message: "Zalogowano" });
        }
    } catch (error) {
        res.send({ error: "Error"});
    }
});

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.send({ error: 'Ten email jest już zajęty' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
        });
        
        res.send(newUser);
    } catch(error) {
        res.send({ error: 'error' });
    }
});

export default router;
