const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  if (message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) {
    let numberToPurge = Number(args[1]) || 10;
    if (numberToPurge > 100) numberToPurge = 100;
    if (numberToPurge < 0) numberToPurge = 1;
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
  type: "moderation",
  commandAliases: ["prune", "clean", "clear"],
};
