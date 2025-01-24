import express from "express";

const app = express();

app.use(express.static("public"));

app.get("/api/message", (req, res) => {
    const message = "Hello :). This Message is From Server";
    res.re;
    res.json({ message });
});

app.listen(8080);
