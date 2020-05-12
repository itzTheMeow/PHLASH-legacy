const Discord = module.require("discord.js");
const ms = require("ms");

module.exports.run = async (bot, message, args, cleanArgs) => {
  let tripTime = Date.now();
  message.channel.send("1 second...").then((m) => {
    let ping = m.createdTimestamp - message.createdTimestamp;
    m.delete(10);
    let botInfoEmbed = new Discord.RichEmbed()
      .setAuthor(bot.user.username + " Info", bot.user.displayAvatarURL)
      .addField("Bot Latency", ms(ping), true)
      .addField("API Latency", ms(Math.round(bot.ping)), true)
      .addField("Message Trip Time", ms(Date.now() - tripTime), true)
      .addField("Uptime", ms(bot.uptime), true)
      .addField("Startup Time", ms(bot.startupTime), true)
      .setColor(bot.config.color);
    message.channel.send(botInfoEmbed);
  });
};
module.exports.help = {
  name: "ping",
  description: "Replies with latency information.",
  usage: "ping",
  type: "other",
  commandAliases: ["uptime", "latency", "test"],
};
