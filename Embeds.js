const Discord = require("discord.js");

module.exports = function (bot) {
  return {
    Rules: new Discord.MessageEmbed()
      .setColor(bot.color)
      .setAuthor(`${bot.guild.name} Rules`, bot.guild.iconURL())
      .setFooter("If you have any questions, please contact Meow.")
      .addField(
        "**1.** No spamming.",
        "No spamming chat. This includes spamming CAPS, emojis, repeated messages, and jibberish."
      )
      .addField(
        "**2.** No racism.",
        "Racism is not tolerated on this server. This includes racial slurs, discrimination, etc."
      ),
  };
};
