const config = require("./config.json");
const express = require("express");
const fs = require("fs");
const https = require("https");
const app = express();

var server = https
  .createServer(
    {
      key: fs.readFileSync("../key.pem"),
      cert: fs.readFileSync("../cert.pem"),
    },
    app
  )
  .listen(process.env.SERVER_PORT, function () {
    console.log("Express server listening on port " + process.env.SERVER_PORT);
  });

const Discord = require("discord.js");
const bot = new Discord.Client();
let startup = Date.now();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/user/:id", (req, res) => {
  let user = req.params.id;
  let userObject = {};

  if (user) {
    let member = bot.guild.members.get(user);
    if (!member) {
      userObject = { error: "User Not Found" };
    } else {
      userObject = {
        avatarURL: member.user.displayAvatarURL,
        color: "#" + ((member.colorRole || {}).color || "").toString(16),
        colorRole: (member.colorRole || {}).name,
        discriminator: member.user.discriminator,
        nickname: member.nickname,
        rolePosition: (member.colorRole || {}).position,
        roles: member.roles.map((r) => r.name),
        tag: member.user.tag,
        username: member.user.username,
      };
    }
  } else {
    userObject = { error: "No User Specified" };
  }

  res.send(JSON.stringify(userObject));
});
app.get("/role/:id", (req, res) => {
  let role = req.params.id;
  let roleObject = {};

  if (role) {
    role = bot.guild.roles.get(role);
    if (!role) {
      roleObject = { error: "Role Not Found" };
    } else {
      roleObject = {
        color: "#" + (role.color || "").toString(16),
        members: role.members.map((m) => m.id) || [],
        name: role.name,
        position: role.position,
      };
    }
  } else {
    roleObject = { error: "No Role Specified" };
  }

  res.send(JSON.stringify(roleObject));
});

app.get("/send/:type", (req, res) => {
  let type = req.params.type;
  let myRes = {};

  switch (type) {
    case "apply-dev":
      myRes = { message: "Sent to Dev!" };
      break;
    default:
      myRes = { error: "Invalid Type" };
  }

  res.json(myRes);
});

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
    this.guild.id == bot.guild.id &&
    (this.roles.has("692159323198980156") || // Administration
      this.hasPermission("ADMINISTRATOR"))
  );
};
GuildMember.prototype.isStaff = function () {
  return (
    this.guild.id == bot.guild.id &&
    (this.isAdmin() ||
    this.roles.has("704843830255550474") || // Manager
      this.roles.has("704844123773075487")) // Moderator
  );
};

Object.prototype.sort = function () {
  let o = this;
  var sorted = {},
    key,
    a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
};

bot.on("ready", () => {
  bot.guild = bot.guilds.get("609287873300267008");
  bot.startupTime = Date.now() - startup;
  console.log(`Bot ${bot.user.username} is on!`);

  bot.user.setActivity(
    `the phlame burn with ${bot.users.filter((u) => !u.bot).size} members!`,
    { type: "WATCHING" }
  );
  bot.user.setStatus("online", null);

  require("./modules/botRequest.js")(bot);
  require("./modules/vars.js")(bot);
  require("./modules/verify.js")(bot);
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
        `Command not found. Try \`${bot.prefix}help\` for a list of commands.`
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

bot.on("messageReactionAdd", (r, u) => {
  let message = r.message;
  if (
    message.guild.id !== bot.guild.id ||
    !message.author.bot ||
    u.bot ||
    ![bot.Emojis.checkmark, bot.Emojis.x].includes(r.emoji.id) ||
    !message.embeds
  )
    return;

  switch (r.emoji.id) {
    case bot.Emojis.checkmark:
      message.channel.send("You reacted with a checkmark.");
      break;
    case bot.Emojis.x:
      message.channel.send("You reacted with an x.");
      break;
  }
});

bot.login(bot.config.token);
bot.setMaxListeners(Infinity);
