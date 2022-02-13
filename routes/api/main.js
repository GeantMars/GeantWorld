const express = require("express");
const router = express.Router();
const db = require("quick.db");
let discoClient;

if(!db.has("forms")) db.set("forms", []);

router.get("/", (req, res) => {
    return res.send("API docs are not finished yet.");
});

router.post("/forms", (req, res) => {
    let forms = Array.from(db.get("forms"));
    if(req.body.questions === null || req.body.questions === undefined) return res.status(400).json({errorMessage: "Bad request."});
    if(req.body.questions.length < 1) return res.status(400).json({errorMessage: "Make at least 1 question."});
    forms.push({
        id: forms.length + 1,
        creator: "Unknown",
        questions: req.body.questions
    });
    db.set("forms", forms);
    if(!db.has(`forms.${forms.length + 1}.responses`)) db.set(`forms.${forms.length + 1}.responses`, []);
    return res.json(db.get("forms"));
});

router.get("/forms", (req, res) => {
    return res.json(db.get(`forms`));
});

router.get("/forms/:id/", (req, res) => {
    let findedForm = forms.find(form => form.id === req.params.id);
    if(!findedForm) return res.status(404).json({errorMessage: "Form not found."});
    return res.json(findedForm);
});

router.post("/forms/:id/responses", (req, res) => {
    let forms = Array.from(db.get(`forms`));
    let findedForm = forms.find(form => form.id === req.params.id);
    if(!findedForm) return res.status(404).json({errorMessage: "Form not found."});
    if(req.body.answers === null || req.body.questions === undefined) return res.status(400).json({errorMessage: "Bad request."});
    if(req.body.answers.length < 1) return res.status(400).json({errorMessage: "Make at least 1 answer."});
    let responses = Array.from(db.get(`forms.${req.params.id}.responses`));
    responses.push({
        id: responses.length + 1,
        username: "Unknown",
        answers: req.body.answers
    });
    db.set(`forms.${req.params.id}.responses`, responses);
    return res.json(db.get(`forms.${req.params.id}.responses`));
});

router.get("/forms/:id/responses", (req, res) => {
    return res.json(db.get(`forms.${parseInt(req.params.id)}.responses`));
});

module.exports = {
    router: router,
    setClient: setClient = (client) => {
        discoClient = client;
    }
}