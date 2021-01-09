const Discord = require("discord.js");

module.exports = function (bot) {
  return {
    Rules: new Discord.MessageEmbed()
      .setColor(bot.color)
      .setAuthor(`${bot.guild.name} Rules`, bot.guild.iconURL()),
  };
};
