const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  let format = function (date) {
    return require("moment").utc(date).format("dddd, MMMM Do YYYY, HH:mm:ss") + " UTC";
  };

  let infoEmbed = new Discord.MessageEmbed()
    .setAuthor(`${message.guild.name} (${message.guild.acronym})`, message.guild.iconURL())
    .setColor(bot.config.color)
    .setThumbnail(message.guild.iconURL())
    .addField("ID", message.guild.id, true)
    .addField("I was added at", format(message.guild.me.joinedAt), true)
    .addField("Created At", format(message.guild.createdAt), true)
    .setFooter(`Requested by ${message.author.tag}.`, message.author.displayAvatarURL());

  message.channel.send(infoEmbed);
};
module.exports.help = {
  name: "serverinfo",
  description: "Gives you info about the server.",
  usage: "serverinfo",
  type: "other",
  commandAliases: ["server", "si"],
};
