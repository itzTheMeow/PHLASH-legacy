const Discord = module.require("discord.js");
const moment = require("moment");

module.exports.run = async (bot, message, args, cleanArgs) => {
  let member = message.mentions.members.first() || message.member;
  let infoEmbed = new Discord.RichEmbed()
    .setAuthor(member.user.tag, member.user.displayAvatarURL)
    .setColor(bot.config.color)
    .setThumbnail(member.user.displayAvatarURL)
    .addField("Nickname", member.nickname || "No Nickname")
    .addField("ID", member.user.id, true)
    .addField(
      "Joined at",
      moment.utc(member.user.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss"),
      true
    )
    .addField("Created At", member.user.createdAt, true)
    .setFooter(
      `Requested by ${message.author.tag}.`,
      message.author.displayAvatarURL
    );
  message.channel.send(infoEmbed);
};
module.exports.help = {
  name: "userinfo",
  description: "Get info about a user.",
  usage: "userinfo <user>",
  type: "utility",
  commandAliases: ["ui", "avatar"],
};
