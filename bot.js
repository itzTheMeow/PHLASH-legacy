const config = require("./config.json");
const fs = require("fs");

const Discord = require("discord.js");
const bot = new Discord.Client();
let startup = Date.now();

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
      this.roles.has("728095591216709714") || // Moderator
      this.roles.has("728407363048046602")) // Staff
  );
};
GuildMember.prototype.isHelper = function () {
  return (
    this.guild.id == bot.guild.id &&
    (this.isStaff() || this.roles.has("742296975285682237")) // Helper
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
  bot.guild = bot.guilds.get("667828697012764703");
  bot.startupTime = Date.now() - startup;
  console.log(
    `Bot ${bot.user.username} is on! Startup time: ${bot.startupTime}`
  );

  bot.user.setActivity(
    `THE GREEN GRASS GROW WITH ${bot.guilds.cache.size} GUILDS!`,
    {
      type: "WATCHING",
    }
  );
  bot.user.setStatus("online");
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
    if (!cmd) return;

    cmd.run(bot, message, args, cleanArgs);
  }
});

bot.login(bot.config.token);
bot.setMaxListeners(Infinity);
