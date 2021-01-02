/* const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  message.delete();
  if (message.member.isAdmin()) {
    message.channel.send(args.slice(1).join(" "));
  } else {
    message.channel.send(cleanArgs.slice(1).join(" "));
  }
};
module.exports.help = {
  name: "say",
  description: "Replies with the text you say.",
  usage: "say [text]",
  type: "fun",
  commandAliases: ["repeat", "speak"],
};
 */

const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  if (!args[1]) return message.channel.send("Please specify text to say!");
  let text = args.slice(1).join(" ");
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    message.channel.send(text);
    return;
  }
  let embed = new Discord.MessageEmbed(json);
  message.channel.send((json.content || ""), embed);
}

module.exports.help = {
  name: "say",
  description: "Replies with the text you say.",
  type: "fun",
  commandAliases: [ "embed" ]
}
