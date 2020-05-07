const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  if (message.member.isAdmin()) {
    bot.user.setStatus(args[1]);
    message.channel.send("I have set the status to " + args[1] + "!");
  } else {
    message.reply("you are not a server admin!");
  }
};
module.exports.help = {
  name: "setstatus",
  description:
    "Sets the bot's status to one of `online`, `idle`, `dnd`, and `invisible`.",
  usage: "setstatus [status]",
  type: "owner",
  commandAliases: ["status"],
};
