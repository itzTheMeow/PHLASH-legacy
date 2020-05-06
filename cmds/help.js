const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  let cmds = [];
  let otherCommands = [];
  let utilityCommands = [];

  Object.keys(bot.commandDescriptions).forEach((cmd) => {
    cmds.push(cmd);
  });

  cmds.forEach((cmd) => {
    if (bot.commandTypes[cmd] == "other") otherCommands.push(cmd);
    if (bot.commandTypes[cmd] == "utility") utilityCommands.push(cmd);
  });

  cmds.sort();
  otherCommands.sort();
  utilityCommands.sort();

  const helpEmbed = new Discord.RichEmbed()
    .setAuthor("Help", message.author.displayAvatarURL)
    .setFooter("Commands", bot.user.displayAvatarURL);

  let cmd = args[1];

  if (!cmd) {
    helpEmbed.setDescription(
      "Use `" +
        bot.prefix +
        " help <command>` to view help on a specific command.\nThese are **[**required**]** and **<**optional**>** fields."
    );
    helpEmbed.addField(
      "All Commands | " + cmds.length,
      "`" + cmds.join("`, `") + "`"
    );
    helpEmbed.addField(
      "Utility | " + utilityCommands.length,
      "`" + utilityCommands.join("`, `") + "`"
    );
    helpEmbed.addField(
      "Other | " + otherCommands.length,
      "`" + otherCommands.join("`, `") + "`"
    );
    message.channel.send(helpEmbed);
    return;
  }

  if (cmd in bot.commandDescriptions) {
    let aliases = [];

    bot.commandAliases.forEach((a) => {
      if (a.for == cmd) aliases = a.aliases;
    });

    if (aliases.length >= 1) {
      aliases = "`" + aliases.join("`, `") + "`";
    } else {
      aliases = "none";
    }

    helpEmbed.setFooter("The " + cmd + " Command");
    helpEmbed.setDescription(
      bot.commandDescriptions[cmd] +
        "\n\n**Usage:** " +
        bot.commandUsages[cmd] +
        "\n**Type:** " +
        bot.commandTypes[cmd] +
        "\n**Aliases:** " +
        aliases
    );
    message.channel.send(helpEmbed);
    return;
  }
  if (!(cmd in bot.commandDescriptions))
    return message.channel.send("That command does not exist!");
};
module.exports.help = {
  name: "help",
  description: "Shows you the commands in the bot.",
  usage: "help <command>",
  type: "other",
  commandAliases: ["commands", "cmds"],
};
