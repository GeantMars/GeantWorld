const express = require("express");
const router = express.Router();
const db = require("quick.db");

router.get("/", (req, res) => {
    return res.send("API docs are not finished yet.");
});

module.exports = router;