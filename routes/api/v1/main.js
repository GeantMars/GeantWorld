const express = require("express");
const router = express.Router();
const db = require("quick.db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

if(!db.has("users")) db.set("users", []);

function generateToken(length) {
    var a = "-abcdefghijklmnopqrstuvwxyz.ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i = 0; i < length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

router.get("/", (req, res) => {
    return res.send("API docs are not finished yet.");
});

router.get("/auth/info", async(req, res) => {
    if(!req.cookies["accessToken"]) return res.status(401).json({
        errorMessage: "You are not signed in."
    });
    let users = Array.from(db.get("users"));
    let findedUser = users.find(data => data.accessToken === req.cookies["accessToken"]);
    if(findedUser) {
        return res.json(findedUser);
    } else {
        return res.status(404).json({errorMessage: "Not found."});
    }
});

router.get("/auth/users", async(req, res) => {
    if(req.headers["authorization"] === process.env.SYSTEM_PASSWORD || req.headers["authorization"] === process.env.ADMIN_PASSWORD) {
        let users = Array.from(db.get("users"));
        return res.json(users);
    } else {
        return res.status(403).json({errorMessage: "You don't have permission to view users."});
    }
});

router.get("/auth/usersCount", async(req, res) => {
    let users = Array.from(db.get("users"));
    return res.json({"count": users.length});
});

router.post("/auth/logout", async(req, res) => {
    if(!req.cookies["accessToken"]) return res.status(401).json({
        errorMessage: "You are not signed in."
    });
    res.clearCookie("accessToken");
    return res.json({message: "Successfully logged out of account."});
});

router.post("/auth/login", async(req, res) => {
    // Authenticate User
    try {
        if(req.cookies["accessToken"]) return res.status(400).json({
            errorMessage: "You are already signed in."
        });
        if(req.body && req.body.username && req.body.password) {
            const newToken = generateToken(59);
            const newRefreshToken = generateToken(59);
            var user = { name: req.body.username }
            const accessToken = jwt.sign(user, newToken);
            const refreshToken = generateToken(59);
            let users = Array.from(db.get("users"));
            let findedUser = users.find(data => data.username === req.body.username);
            if(findedUser) {
                let passwordMatched = await bcrypt.compare(req.body.password, findedUser.password);
                if(!passwordMatched) return res.status(403).json({errorMessage: "Incorrect password."});
                db.set(`users.${users.indexOf(findedUser)}.accessToken`, accessToken);
                res.cookie("accessToken", accessToken, {maxAge: 60 * 60 * 1000, secure: true});
                users = Array.from(db.get("users"));
                let result = users.find(data => data.username === req.body.username);
                return res.json({user: result});
            } else {
                return res.status(404).json({errorMessage: "Account you are trying to sign in was not found. Try different account or make new one."});
            }
        } else {
            return res.status(400).json({
                errorMessage: "Bad Request."
            });
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            errorMessage: "Looks like the Auth has issues at this moment."
        });
    }
});

router.post("/auth/signup", async(req, res) => {
    // Authenticate User
    try {
        if(req.cookies["accessToken"]) return res.status(400).json({
            errorMessage: "You are already signed in."
        });
        if(req.body && req.body.username && req.body.email && req.body.password) {
            const newToken = generateToken(59);
            const newRefreshToken = generateToken(59);
            var user = { name: req.body.username }
            const accessToken = jwt.sign(user, newToken);
            const refreshToken = generateToken(59);
            let users = Array.from(db.get("users"));
            let findedUser = users.find(data => data.username === req.body.username);
            if(!findedUser) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
                db.set(`users.${users.length}`, {
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                    accessToken: accessToken
                });
                res.cookie("accessToken", accessToken, {maxAge: 60 * 60 * 1000, secure: true});
                users = Array.from(db.get("users"));
                let result = users.find(data => data.username === req.body.username);
                return res.json({user: result});
            } else {
                return res.status(403).json({errorMessage: "Account you are trying to sign up already exists. Please try different account."});
            }
        } else {
            return res.status(400).json({
                errorMessage: "Bad Request."
            });
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            errorMessage: "Looks like the Auth has issues at this moment."
        });
    }
});

module.exports = router;