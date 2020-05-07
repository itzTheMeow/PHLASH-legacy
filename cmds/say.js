const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  message.delete();
  if (message.member.isStaff()) {
    message.channel.send(args.slice(1).join(" "));
  } else {
    message.channel.send(cleanArgs.slice(1).join(" "));
  }
};
module.exports.help = {
  name: "say",
  description: "Replies with the text you say.",
  usage: "say [text]",
  type: "",
  commandAliases: ["repeat", "speak"],
};
