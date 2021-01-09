const config = require("./config.json");
const fs = require("fs");

const Discord = require("discord.js");
const { GuildMember } = require("discord.js");
const bot = new Discord.Client();
let startup = Date.now();

require("tcc-cdn")("texttools").use();

const db = require("enhanced.db");

bot.prefix = config.prefix;
bot.config = config;
bot.db = db;
bot.color = config.color;
bot.changelog = require("./changelog.json");
bot.ver = Object.keys(bot.changelog)[Object.keys(bot.changelog).length - 1];

bot.commands = new Discord.Collection();
bot.commandDescriptions = {};
bot.commandUsages = {};
bot.commandAliases = [];
bot.commandRequirements = {};
bot.commandTypes = {};

GuildMember.prototype.isBotAdmin = function () {
  return bot.config.admins.includes(this.id);
};
GuildMember.prototype.isAdmin = function () {
  return this.hasPermission("ADMINISTRATOR") || this.isBotAdmin();
};

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

bot.on("ready", () => {
  bot.guild = bot.guilds.cache.get("618450314567352322");
  bot.startupTime = Date.now() - startup;
  console.log(`Bot ${bot.user.username} is on! Startup time: ${bot.startupTime}ms`);
  bot.Embeds = require("./Embeds.js")(bot);

  require("./modules/pollCache.js")(bot);
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
bot.on("messageReactionAdd", (messageReaction, user) => {
  require("./modules/pollFilter.js")(messageReaction, user);
});

bot.login(bot.config.token);
bot.setMaxListeners(Infinity);
