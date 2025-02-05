import express from "express";

const router = express.Router();

router.use("/favicon.ico", express.static("public/icons/favicon.ico"));
router.use("/site.webmanifest", express.static("public/site.webmanifest"));
router.get("/faq", (_, res) => {
    res.render("faq");
});
router.get("/about", (_, res) => {
    res.render("about");
});
router.get("/login", (_, res) => {
    res.render("login");
});
router.get("/register", (_, res) => {
    res.render("register");
});
router.get("/", (req, res) => {
    if (req.hostname == "Jurek Owsiak") {
        res.send("Oddaj pieniądze żydzie");
    } else
        res.render("index", {
            title: "Strona główna",
            products: ["test", "test2", "test3"],
        });
});

export default router;
