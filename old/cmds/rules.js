const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  message.delete();
  if (message.member.isAdmin()) {
    let channel = message.mentions.channels.first() || message.channel;
    channel.send(bot.Embeds.rules);
    message.channel.send("Rules sent to " + channel + "!").then((msg) => msg.delete(4000));
  } else {
    message.reply("you are not a bot admin!");
  }
};
module.exports.help = {
  name: "rules",
  description: "Sends the rules in the specified channel.",
  usage: "rules <channel>",
  type: "admin",
  commandAliases: [],
};
