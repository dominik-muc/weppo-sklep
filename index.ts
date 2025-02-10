import express from "express";
import api from "./routes/api";
import index from "./routes/index";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("supersecret"));

app.set("view engine", "pug");
app.set("views", "./views");

app.use("/static", express.static("public"));

app.use((req, res, next) => {
    res.locals.user = req.signedCookies.user || null;
    next();
});

app.use("/api", api);
app.use("/", index);

app.use((req, res) => {
    res.send("404");
});


app.listen(8080);

