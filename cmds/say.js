const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  message.delete();
  if (message.member.isStaff()) {
    message.channel.send(args.join(" "));
  } else {
    message.channel.send(cleanArgs.join(" "));
  }
};
module.exports.help = {
  name: "say",
  description: "Replies with the text you say.",
  usage: "say [text]",
  type: "utility",
  commandAliases: ["repeat", "speak"],
};
