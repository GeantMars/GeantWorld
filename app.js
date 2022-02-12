require("dotenv").config();

const Discord = require("discord.js");
const db = require("quick.db");
const fs = require("fs");
const webServer = require("./webServer");
const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES], partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"]});
var prefix = "G!";
var activitiesInterval;

db.set("botSettings", {
    "activities": [
        {
            "Name": "https://geantworldweb.tk/",
            "Type": "PLAYING"
        }
    ]
});

// Start Web Server
webServer.run(1967);

// Allow Permission to Set Discord Bot's Client on Website Server
webServer.setClient(client);

var chooseActivity = () => {
    try {
        var activitiesData = db.get("botSettings.activities");
        const activity = activitiesData[Math.floor(Math.random() * Array.from(activitiesData).length)];
        client.user.setPresence({ activities: [{ name: activity.Name, type: activity.Type }], status: "online" });
    } catch(err) {
        console.log("ERROR: Something went wrong with the activities.");
        client.user.setPresence({ activities: [{ name: "Example", type: "WATCHING" }], status: "idle" });
        clearInterval(activitiesInterval);
    }
}

client.on("ready", () => {
    console.log(client.user.tag + " has connected to Discord!");
    let ourGuild = client.guilds.cache.find(g => g.id === "894318297212944415");
    chooseActivity();
    activitiesInterval = setInterval(() => {
        chooseActivity();
    }, 10000);
});

client.on("guildMemberAdd", (member) => {
	var joinChannel = member.guild.channels.cache.find(c => c.name.includes("bienvenue"));
    var memberRole = member.guild.roles.cache.find(r => r.name.includes("Member"));
    member.roles.add(memberRole.id);
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Bienvenue à GeantWorld!");
    embed.setDescription(member.user.tag + " a rejoint le serveur.");
    embed.setColor("#00FF00");
    embed.setImage(member.user.avatarURL);
	joinChannel.send({
        embeds: [
            embed
        ]
    });
});

client.on("guildMemberRemove", (member) => {
	var leaveChannel = member.guild.channels.cache.find(c => c.name.includes("au-revoir"));
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Au revoir");
    embed.setDescription(member.user.tag + " a quitté le serveur.");
    embed.setColor("#FF0000");
    embed.setImage(member.user.avatarURL);
	leaveChannel.send({
        embeds: [
            embed
        ]
    });
});

client.on("messageCreate", (msg) => {
    if(msg.author.bot) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g); 
    const cmd = args.shift();
    if(msg.channel.type == "DM") {
        let ourGuild = client.guilds.cache.find(g => g.id === "894318297212944415");
        let botDMLogsChannel = ourGuild.channels.cache.find(channel => channel.name.includes("logs"));
        botDMLogsChannel.send("**NOUVEAU JOURNAL DM À PARTIR DE GEANTWORLD!**\n```Utilisateur: "+msg.author.tag+"\nMessage: "+msg.content+"```");
    }
    if(msg.content.indexOf(prefix) !== 0) return;
    if (cmd === "staff" || cmd === "music") {
        if(args[0]) {
            if(fs.existsSync(`./commands/${cmd}/${args[0]}.js`)) {
                let commandFile = require(`./commands/${cmd}/${args[0]}.js`);
                if(commandFile !== undefined && commandFile !== null) {
                    try {
                        commandFile.run(client, msg, args);
                    } catch(err) {
                        console.log(err);
                        msg.channel.send("Quelque chose s'est mal passé avec la commande.");
                    }
                }
            }
        }
    } else {
        if(fs.existsSync(`./commands/${cmd}.js`)) {
            let commandFile = require(`./commands/${cmd}.js`);
            try {
                commandFile.run(client, msg, args);
            } catch(err) {
                console.log(err);
                msg.channel.send("Quelque chose s'est mal passé avec la commande.");
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);