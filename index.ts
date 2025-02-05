import express from "express";
import api from "./routes/api";
import index from "./routes/index";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", "./views");

app.use("/static", express.static("public"));
app.use("/api", api);
app.use("/", index);

app.use((req, res) => {
    res.send("404");
});


app.listen(8080);

