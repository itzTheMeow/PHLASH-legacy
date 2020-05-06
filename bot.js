const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");

const config = require("./config.json");
bot.prefix = config.prefix;
bot.config = config

bot.commands = new Discord.Collection();
bot.commandDescriptions = new Object();
bot.commandUsages = new Object();
bot.commandTypes = new Object();
bot.commandAliases = [];
bot.commandRequirements = new Object();

fs.readdir("./cmds/", (err, files) => {
  if (err) throw err;

  let jsFiles = files.filter(f => f.split(".").pop() === "js");

  jsFiles.forEach(f => {
    let props = require(`./cmds/${f}`);
    bot.commands.set(props.help.name, props);
    bot.commandDescriptions[props.help.name] = props.help.description;
    bot.commandUsages[props.help.name] =
      "`" + bot.prefix + props.help.usage + "`";
    bot.commandTypes[props.help.name] = props.help.type;
    if (props.help.commandAliases.length >= 1)
      bot.commandAliases.push({
        for: props.help.name,
        aliases: props.help.commandAliases
      });
  });
  console.log(`Loaded ${jsFiles.length} commands!`);
});

bot.on("ready", () => {
  console.log(`Bot ${bot.user.username} is on!`);
  bot.user.setActivity(bot.guilds.size + " servers. | " + bot.prefix + "help", {
    type: "WATCHING"
  });
  bot.user.setStatus("online", null);
});

bot.on("message", message => {
  if (message.author.bot) return;
  if (message.content.startsWith(bot.prefix)) {
    let args = message.content
      .substring(bot.prefix.length)
      .trim()
      .split(/ +/g);

    let cmd = bot.commands.get(args[0].toLowerCase());

    if (!cmd) {
      let name;

      bot.commandAliases.forEach(a => {
        if (a.aliases.includes(args[0].toLowerCase())) name = a.for;
      });

      cmd = bot.commands.get(name);
    }
    if (!cmd) return message.channel.send("I couldn't find that command.");

    cmd.run(bot, message, args);
  }
});

bot.login(bot.config.token);
