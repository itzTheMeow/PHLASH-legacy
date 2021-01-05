const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  message.delete();
  if (message.member.isAdmin()) {
    message.channel.send(args.slice(1).join(" "));
  } else {
    message.channel.send(args.slice(1).join(" "), { disableMentions: "all" });
  }
};
module.exports.help = {
  name: "say",
  description: "Replies with the text you say.",
  usage: "say [text]",
  type: "fun",
  commandAliases: ["repeat", "speak"],
};
