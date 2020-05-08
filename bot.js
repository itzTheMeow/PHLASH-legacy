const express = require("express");
const app = express();

app.get("/user/:id", (req, res) => {
  let user = req.params.id;
  let userObject;
  if (user) {
    let member = bot.guild.members.fetch(user) || {};
    if (!member) userObject = { error: "User Not Found" };
    else {
      userObject = {
        username: member.user.username,
        discriminator: member.user.discriminator,
        tag: member.user.tag,
        avatarURL: member.user.displayAvatarURL,
        nickname: member.nickname,
      };
    }
  } else {
    userObject = { error: "User Not Found" };
  }

  res.send(JSON.stringify(userObject));
});

const listener = app.listen(process.env.SERVER_PORT, () => {
  console.log("Listening on port " + listener.address().port);
});

const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");

require("tcc-cdn")("texttools").use();

const db = {
  fetch: (key) => {
    return require("./database.json")[key];
  },
  add: (key, value) => {
    let data = require("./database.json");
    data[key] = data[key] || 0;
    data[key] += value;
    fs.writeFileSync("./database.json", JSON.stringify(data));
    return data;
  },
  subtract: (key, value) => {
    let data = require("./database.json");
    data[key] = data[key] || 0;
    data[key] -= value;
    fs.writeFileSync("./database.json", JSON.stringify(data));
    return data;
  },
  set: (key, value) => {
    let data = require("./database.json");
    data[key] = value;
    fs.writeFileSync("./database.json", JSON.stringify(data));
    return data;
  },
};
db.get = db.set;
db.sub = db.subtract;

const config = require("./config.json");
bot.prefix = config.prefix;
bot.config = config;
bot.db = db;
bot.imgur = require("imgur-uploader");

bot.commands = new Discord.Collection();
bot.commandDescriptions = {};
bot.commandUsages = {};
bot.commandAliases = [];
bot.commandRequirements = {};
bot.commandTypes = {};

fs.readdir("./cmds/", (err, files) => {
  if (err) throw err;

  let jsFiles = files.filter((f) => f.split(".").pop() === "js");

  jsFiles.forEach((f) => {
    let props = require(`./cmds/${f}`);
    bot.commands.set(props.help.name, props);
    bot.commandDescriptions[props.help.name] = props.help.description;
    bot.commandUsages[props.help.name] = `\`${bot.prefix}${props.help.usage}\``;
    bot.commandTypes[props.help.name] = props.help.type;
    if (props.help.commandAliases.length)
      bot.commandAliases.push({
        for: props.help.name,
        aliases: props.help.commandAliases,
      });
  });
  console.log(`Loaded ${jsFiles.length} commands!`);
});

const { GuildMember } = require("discord.js");
GuildMember.prototype.isAdmin = function () {
  return (
    this.roles.has("") || // Administration
    this.roles.has("") || // Manager
    this.hasPermission("ADMINISTRATOR")
  );
};
GuildMember.prototype.isStaff = function () {
  return (
    this.isAdmin() ||
    this.roles.has("") || // Moderator
    this.roles.has("") // Developer
  );
};

bot.embeds = {
  rules: new Discord.RichEmbed()
    .setTitle("Server Rules")
    .setColor(bot.config.color)
    .addField(
      "**1.** No NSFW",
      "No NSFW is allowed in any of the channels. NSFW posted by anyone will result in a kick from our server."
    )
    .addField(
      "**2.**No Racism",
      "No RACISM. Everyone is equal in this server. In the year  2020, racism should not be a thing. Any racist abuse towards anyone will result in a kick from our server."
    )
    .addField(
      "**3.** USE RIGHT CHANNELS",
      "Please use the appropriate channels. The punishment ladder for this rule goes as follows: Warning, Warning, Mute, Kick."
    )
    .addField(
      "**4.** Read Rules!",
      "'I didn't read the rules' is NOT an excuse. Punishment is the same for everyone (including staff) regardless of if you have read the server rules or not."
    )
    .addField(
      "**5.** NO pinging!",
      "Do not ping any of the Devs, Admins, Moderators or Owner unless they have told you to. If you have any questions, just ask and someone will definitely come to your aid. "
    )
    .addField(
      "**6.** NO spamming!",
      "Do not spam. Spamming will result in a warn, then a mute, and then a ban if it is continued. Mass pinging will result in an immediate ban from our server."
    )
    .setFooter(
      "We are glad that you decided to join as a member of PHLAME Development!"
    ),
};

bot.on("ready", () => {
  bot.guild = bot.guilds.get("609287873300267008");
  console.log(`Bot ${bot.user.username} is on!`);

  bot.user.setActivity(
    `the phlame burn with ${
      bot.guild.members.filter((m) => !m.user.bot).size
    } members!`,
    { type: "WATCHING" }
  );
  bot.user.setStatus("online", null);
});

bot.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(bot.prefix)) {
    let args = message.content.substring(bot.prefix.length).trim().split(/ +/g);
    let cleanArgs = message.cleanContent
      .substring(bot.prefix.length)
      .trim()
      .split(/ +/g);

    let cmd = bot.commands.get(args[0].toLowerCase());

    if (!cmd) {
      let name;

      bot.commandAliases.forEach((a) => {
        if (a.aliases.includes(args[0].toLowerCase())) name = a.for;
      });

      cmd = bot.commands.get(name);
    }
    if (!cmd)
      return message.channel.send(
        "That command is non-existent in my directory."
      );

    cmd.run(bot, message, args, cleanArgs);
  }
});

bot.on("guildMemberAdd", (member) => {
  console.log(member.user.tag + " has joined the server!");
  var role = member.guild.roles.find((r) => r.name == "Verify");
  if (role) member.addRole(role);

  let joinEmbed = new Discord.RichEmbed()
    .setTitle(`Welcome to the server!`)
    .setTimestamp()
    .setColor(bot.config.color)
    .setDescription(`Welcome, ${member.tag}! Stay to watch the phlame burn!`);

  bot.channels.get("704771723941118033").send(joinEmbed);
});

bot.on("guildMemberRemove", (member) => {
  console.log(member.user.tag + " has left the server!");

  let leaveEmbed = new Discord.RichEmbed()
    .setTitle("Goodbye...")
    .setTimestamp()
    .setColor(bot.config.color)
    .setDescription(
      `Sad to see you leave ${member.tag}. Hope to see you soon!`
    );

  bot.channels.get(`704771723941118033`).send(leaveEmbed);
});

bot.login(bot.config.token);
