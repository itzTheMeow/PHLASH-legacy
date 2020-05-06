const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  if (message.member.hasPermission("MANAGE_MESSAGES")) {
    let numberToPurge = Number(args[0]) || 10;
      await message.delete();
      await message.channel.bulkDelete(numberToPurge);
  } else {
    message.reply("you do not have permission to purge messages!");
  }
};
module.exports.help = {
  name: "purge",
  description: "Purges messages a channel.",
  usage: "purge <messages>",
  commandAliases: ["prune", "clean", "clear"],
};
