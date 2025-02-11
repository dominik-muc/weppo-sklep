import express from "express";
import api from "./routes/api";
import admin from "./routes/admin";
import index from "./routes/index";
import cookieParser from "cookie-parser";
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("supersecret"));

app.set("view engine", "pug");
app.set("views", "./views");

app.use("/static", express.static("public"));

app.use(async (req, res, next) => {
    const userEmail = req.signedCookies.user || null;
    res.locals.user = userEmail;

    if (userEmail) {
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        res.locals.role = user ? user.role : null;
    } else {
        res.locals.role = null;
    }

    next();
});

app.use("/api", api);
app.use("/admin", admin);
app.use("/", index);

app.use((req, res) => {
    res.send("404");
});


app.listen(8080);

