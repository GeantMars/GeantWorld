const express = require("express");
const db = require("quick.db");
const app = express();
const fs = require("fs");
const cookieParser = require("cookie-parser");

let discoClient;

if(!db.has("maintenanceMode")) db.set("maintenanceMode", false);

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("./public/"));

module.exports = {
    run: run = (port) => {

        // Checking for Error 503 page (Under Maintenance page)
        app.use((req, res, next) => {
            if(!res.headersSent) {
                if(db.get("maintenanceMode") === true) {
                    return res.status(503).render("maintenance", {});
                } else {
                    if(!res.headersSent) {
                        return next();
                    }
                }
            }
        });

        // API Routes Setup
        if(fs.existsSync(`./routes/api/main.js`)) {
            const routeFile = require(`./routes/api/main`);
            routeFile.setClient(discoClient);
            app.use("/api/", routeFile.router);
        }

        // API v1 Routes Setup
        if(fs.existsSync(`./routes/api/v1/main.js`)) {
            const route = require(`./routes/api/v1/main`);
            app.use("/api/v1/", route);
        }

        // API v2 Routes Setup
        if(fs.existsSync(`./routes/api/v2/main.js`)) {
            const route = require(`./routes/api/v2/main`);
            app.use("/api/v2/", route);
        }

        // JSON Routes Setup
        if(fs.existsSync(`./routes/json/main.js`)) {
            const route = require(`./routes/json/main`);
            app.use("/json/", route);
        }

        // Main Routes Setup
        if(fs.existsSync(`./routes/main.js`)) {
            const route = require(`./routes/main`);
            app.use("/", route);
        }

        // Checking for Error 404 page
        app.use((req, res, next) => {
            if(!res.headersSent) {
                return res.status(404).render("errorPages/404", {});
            }
        });

        // Checking for server errors (Error 500 page)
        app.use((err, req, res, next) => {
            if(!res.headersSent) {
                res.status(500).render("errorPages/500", {errorMsg: err});
                console.log(err);
                return;
            }
        });

        // Run Website Server
        app.listen(port, () => {
            console.log("Website running.");
        });

    },
    setClient: setClient = (client) => {
        discoClient = client;
    }
}