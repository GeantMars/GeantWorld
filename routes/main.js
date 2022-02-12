const express = require("express");
const router = express.Router();
const db = require("quick.db");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/music", (req, res) => {
    res.render("music");
});

router.get("/videos", (req, res) => {
    res.render("videos")
})

router.get("/robloxstudioservices", (req, res) => {
    res.render("studio")
})

router.get("/rblxforms", (req, res) => {
    res.render("formsrblx")
})

router.get("/info", (req, res) => {
    res.render("info")
})

router.get("/recrutement", (req, res) => {
    res.render("recrut")
})

router.get("/reglement", (req, res) => {
    res.render("reglement")
})

router.get("/information", (req, res) => {
    res.render("information")
})

router.get("/account/view", (req, res) => {
    res.render("viewAccount", {});
});

router.get("/account/login", (req, res) => {
    res.render("login", {});
});

router.get("/account/signup", (req, res) => {
    res.render("signup", {});
});

module.exports = router