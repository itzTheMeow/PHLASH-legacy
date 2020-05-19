const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  if (message.guild.id !== bot.guild.id)
    return message.channel.send(
      "You must use this command in the Phlame Development server!"
    );

  let channel = message.author;
  try {
    channel.send("Compiling bot request...");
  } catch (e) {
    channel = message.channel;
    channel.send("Your DMs were off, taking the request here instead...");
  }

  let embed = new Discord.RichEmbed();
  embed.setColor(bot.config.color);
  embed.setFooter("Please answer all questions to the best of your ability.");
};
module.exports.help = {
  name: "request",
  description: "Requests a bot from the server.",
  usage: "request",
  type: "server",
  commandAliases: ["req"],
};
