const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  let serverInfoEmbed = new Discord.RichEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL)
    .addField(
      "**Members**",
      `Online: ${message.guild.members.size}
Offline: ${message.guild.members.size}
Users: ${message.guild.members.size}
Bots: ${message.guild.members.size}
All: ${message.guild.members.size}`
    );
};
module.exports.help = {
  name: "serverinfo",
  description: "Gives you info about the server.",
  usage: "serverinfo",
  type: "other",
  commandAliases: ["server", "si"],
};
