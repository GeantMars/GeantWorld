const Discord = require("discord.js");
const db = require("quick.db");

exports.run = (client, msg, args) => {
    if(!msg.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return msg.channel.send("Cette commande n'est pas pour vous !");
    if(!db.has("maintenanceMode")) return msg.channel.send("Notre base de données n'a pas pu trouver la clé maintenanceMode.");
    if(db.get("maintenanceMode") === true) {
        db.set("maintenanceMode", false);
        msg.channel.send("Le mode de maintenance a été défini sur désactivé.");
    } else {
        db.set("maintenanceMode", true);
        msg.channel.send("Le mode de maintenance a été défini sur activé.");
    }
}