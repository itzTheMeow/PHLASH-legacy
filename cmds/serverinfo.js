const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  let serverInfoEmbed = new Discord.RichEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL)
    .addField(
      "**Members**",
      `Online: ${
        message.guild.members.filter((m) => m.presence.status !== "offline")
          .size
      }
Offline: ${
        message.guild.members.filter((m) => m.presence.status == "offline").size
      }
Users: ${message.guild.members.filter((m) => !m.user.bot).size}
Bots: ${message.guild.members.filter((m) => m.user.bot).size}
All: ${message.guild.members.size}`
    );

  message.channel.send(serverInfoEmbed);
};
module.exports.help = {
  name: "serverinfo",
  description: "Gives you info about the server.",
  usage: "serverinfo",
  type: "other",
  commandAliases: ["server", "si"],
};
