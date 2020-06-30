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

const { GuildMember, TextChannel } = require("discord.js");
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
TextChannel.prototype.fetchAllMessages = async function (limit) {
  let channel = this;
  limit = limit || Infinity;

  let pr = new Promise(async (resolve, reject) => {
    const sum_messages = [];
    let last_id;

    while (true) {
      const options = { limit: 100 };
      if (last_id) {
        options.before = last_id;
      }

      const messages = await channel.fetchMessages(options);

      if (!messages.last()) {
        resolve(sum_messages);
        break;
      }

      sum_messages.push(...messages.array());
      last_id = messages.last().id;

      if (messages.size != 100 || sum_messages >= limit) {
        resolve(sum_messages);
        break;
      }
    }
  });
  return pr;
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

  bot.user.setActivity(`the phlame burn with ${bot.users.filter((u) => !u.bot).size} members!`, {
    type: "WATCHING",
  });
  bot.user.setStatus("online", null);

  require("./modules/botRequest.js")(bot);
  require("./modules/vars.js")(bot);
  require("./modules/verify.js")(bot);

  bot.channels.get(bot.request.channels.requests).fetchAllMessages();
  bot.channels.get(bot.request.channels.requestsCategory).children.forEach((c) => {
    c.fetchAllMessages();
  });
});

bot.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(bot.prefix)) {
    let args = message.content.substring(bot.prefix.length).trim().split(/ +/g);
    let cleanArgs = message.cleanContent.substring(bot.prefix.length).trim().split(/ +/g);

    let cmd = bot.commands.get(args[0].toLowerCase());

    if (!cmd) {
      let name;

      bot.commandAliases.forEach((a) => {
        if (a.aliases.includes(args[0].toLowerCase())) name = a.for;
      });

      cmd = bot.commands.get(name);
    }
    if (!cmd) return;

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
    .setDescription(`Welcome, ${member.user.tag}! Stay to watch the Phlame burn!`);

  bot.channels.get("704771723941118033").send(joinEmbed);
});

bot.on("guildMemberRemove", (member) => {
  console.log(member.user.tag + " has left the server!");

  let leaveEmbed = new Discord.RichEmbed()
    .setTitle("Goodbye...")
    .setTimestamp()
    .setColor(bot.config.color)
    .setDescription(`Sad to see you leave ${member.user.tag}. Hope to see you soon!`);

  bot.channels.get(`704771723941118033`).send(leaveEmbed);
});

bot.on("messageReactionAdd", async (r, u) => {
  let message = r.message;
  if (message.guild.id !== bot.guild.id || !message.author.bot || u.bot || !message.embeds) return;

  let requestType = "";
  switch (((message.embeds[0] || {}).footer || {}).text) {
    case bot.request.footers.pendingRequest:
      requestType = "accept";
      break;
    case bot.request.footers.pendingCompletion:
      requestType = "finish";
      break;
    default:
      return;
  }
  if (!requestType) return;

  let requestChannel =
    requestType == "finish" ? message.channel : message.mentions.channels.first();
  let requestUser = message.mentions.members.first();

  if (!requestChannel || !requestUser) return;

  r.remove(u.id);

  switch (r.emoji.id) {
    case bot.Emojis.checkmark:
      if (requestType == "finish") {
        if (u.id == requestUser.id || (bot.guild.members.get(u.id) || {}).isAdmin()) {
          let areYouSureComplete = await message.channel.send(
            "Are you sure you would like to mark this request as complete?\nThis will archive it."
          );
          await areYouSureComplete.react(bot.Emojis.checkmark);
          await areYouSureComplete.react(bot.Emojis.x);

          areYouSureComplete
            .awaitReactions(
              (filterR, filterU) =>
                filterU.id == requestUser.id &&
                [bot.Emojis.checkmark, bot.Emojis.x].includes(filterR.emoji.id),
              { max: 1 }
            )
            .then(async (reaction) => {
              reaction = reaction.first();
              areYouSureComplete.clearReactions();
              switch (reaction.emoji.id) {
                case bot.Emojis.checkmark:
                  let archiving = await message.channel.send("Archiving request...");
                  await message.channel.edit({
                    parent: bot.request.channels.archivedCategory,
                    position: 0,
                  });
                  await archiving.edit("Archived!");
                  break;
                case bot.Emojis.x:
                  message.channel.send("The request will not be archived.");
                  break;
              }
            });
        } else {
          message.channel.send("You can not archive this request!");
        }
      }
      break;
    case bot.Emojis.x:
      if (requestType == "finish") {
        if (u.id == requestUser.id) {
          let areYouSureCancel = await message.channel.send(
            "Please provide a reason for canceling this request. If you do not want to cancel it, say `keep`."
          );

          message.channel
            .awaitMessages((filterM) => filterM.author.id == requestUser.id, { max: 1 })
            .then(async (msg) => {
              msg = msg.first();

              if (msg.content.toLowerCase() == "keep") {
                message.channel.send("This request will not be canceled.");
              } else {
                await message.channel.send("Deleting request...");
                await message.channel.delete();

                let deletedEmbed = new Discord.RichEmbed();
                deletedEmbed.setAuthor(
                  "Request deleted by " + msg.author.tag,
                  msg.author.displayAvatarURL
                );
                deletedEmbed.setDescription(msg.content || "No Reason Provided");
                deletedEmbed.addField("Channel Name", "#" + (message.channel.name || "unknown"));
                deletedEmbed.addField("Request Submitted By", requestUser.tag);
                deletedEmbed.setColor(bot.config.color);
                deletedEmbed.setTimestamp();

                await bot.guild.channels.get(bot.request.channels.requests).send(deletedEmbed);
              }
            });
        } else {
          message.channel.send("You can not cancel this request!");
        }
      } else {
        if ((bot.guild.members.get(u.id) || {}).isAdmin()) {
          message.channel.send("Admin deleted request.");
        } else {
          message.channel.send("You can not delete this request!");
        }
      }
      break;
    default:
      return;
  }
});

bot.login(bot.config.token);
bot.setMaxListeners(Infinity);
