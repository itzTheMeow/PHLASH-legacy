const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let json = args.slice(1).join(" ") || "";
  try {
    json = JSON.parse(json);
  } catch (err) {
    return message.channel.send(`Please specify valid embed JSON! Error: ${err}`);
  }

  let embed = new Discord.MessageEmbed();
  embed.setColor("#FFFFFF");
  embed.setTitle("Failed to create embed.");
  embed.setDescription(
    "Failed to create embed due to invalid JSON. Check your JSON/generator and try again."
  );

  try {
    embed = new Discord.MessageEmbed(json);
  } catch (err) {
    message.channel.send({ embed });
    return;
  }

  if (message.member.isAdmin()) {
    message.channel.send({ embed }).catch((err) => {
      message.channel.send(String(err));
    });
  } else {
    message.channel.send({ embed, disableMentions: "all" }).catch((err) => {
      message.channel.send(String(err));
    });
  }
};

module.exports.help = {
  name: "embed",
  description: "Sends an embed using JSON input.",
  usage: "embed [json]",
  type: "fun",
  commandAliases: [],
};
