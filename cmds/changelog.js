const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let ver = args[1];
  let log = bot.changelog[ver];
  if (!log) {
    ver = bot.ver;
    log = bot.changelog[ver];
  }

  let changelog = new Discord.MessageEmbed()
    .setAuthor("PHLASH Changelog", bot.user.displayAvatarURL())
    .setDescription(
      `**Current Version:** ${bot.ver}
**Previous Versions:** \`${Object.keys(bot.changelog).join("`, `")}\``
    )
    .setFooter(`This is a ${log.code.toLowerCase()} phase log.`)
    .addField(`${log.date} - v${ver}`, `- ${log.changes.join("\n- ")}`);
  message.channel.send(changelog);
};
module.exports.help = {
  name: "changelog",
  description: "Shows the latest updates",
  usage: "changelog <version>",
  type: "info",
  commandAliases: ["changes", "history"],
};
