const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  let member = message.mentions.members.first();
  if (!member) return message.channel.send("Please specify a member to ban!");

  let reason = args.slice(2).join(" ") || "No reason provided.";

  if (member.id == message.member.id) return message.channel.send("You can not ban yourself!");

  if (message.member.hasPermission("BAN_MEMBERS")) {
    if (!message.guild.me.hasPermission("BAN_MEMBERS"))
      return message.channel.send("I do not have the BAN_MEMBERS permission!");

    if (!member.bannable) return message.channel.send("I can not ban this member!");

    if (
      member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0 &&
      message.guild.owner.id !== message.member.id
    )
      return message.channel.send("You can not ban this member! They have too high of a role.");

    await member.user
      .send(`You have been banned from ${message.guild.name} for **${reason}**.`)
      .catch((err) => {
        message.channel.send("I couldn't message the user.");
      });
    await message.guild.members.ban(member, { reason, days: 0 });
    await message.channel.send(`Banned ${member.toString()} (ID: ${member.id}) for **${reason}**.`);
  } else {
    message.channel.send("You do not have permission to ban members!");
  }
};
module.exports.help = {
  name: "ban",
  description: "Bans a member from the server.",
  usage: "ban [user] <reason>",
  type: "moderation",
  commandAliases: ["b"],
};
