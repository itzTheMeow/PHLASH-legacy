const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  if (!args[1]) return message.channel.send("Please specify embed JSON!");
  let json = args.slice(1).join(" ");
  try {
    json = JSON.parse(text);
  } catch (err) {
    message.channel.send("Please specify valid embed JSON!");
    return;
  }
  try {
    let embed = new Discord.MessageEmbed(json);
  } catch (err) {
    message.channel.send("Sorry, that JSON doesn't work as an embed due to Discord limitations.");
    return;
  }  
  if (message.member.isAdmin()) {
    message.channel.send((json.content || ""), embed);
  } else {
    message.channel.send((json.content || ""), embed, { disableMentions: "all" });
  }
}

module.exports.help = {
  name: "embed",
  description: "Replies with the equivelant embed to the given JSON.",
  usage: "embed [embed json]",
  type: "fun",
  commandAliases: []
}
