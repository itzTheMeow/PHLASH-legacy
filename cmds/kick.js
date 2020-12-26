const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  let member = message.mentions.members.first();
  if (!member) return message.channel.send("Please specify a member to kick!");

  let reason = args.slice(2).join(" ") || "No reason provided.";

  if (member.id == message.member.id) return message.channel.send("You can not kick yourself!");

  if (message.member.hasPermission("KICK_MEMBERS")) {
    if (!message.guild.me.hasPermission("KICK_MEMBERS"))
      return message.channel.send("I do not have the KICK_MEMBERS permission!");
    if (!member.kickable) return message.channel.send("I can not kick this member!");
    if (
      member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0 &&
      message.guild.owner.id !== message.member.id
    )
      return message.channel.send("You can not kick this member! They have too high of a role.");

    await member.user
      .send(`You have been kicked from ${message.guild.name} for **${reason}**.`)
      .catch((err) => {
        message.channel.send("I couldn't message the user.");
      });
    await member.kick(reason);
    await message.channel.send(`Kicked ${member.toString()} (ID: ${member.id}) for **${reason}**.`);
  } else {
    message.channel.send("You do not have permission to kick members!");
  }
};
module.exports.help = {
  name: "kick",
  description: "Kicks a member from the server.",
  usage: "kick [user] <reason>",
  type: "moderation",
  commandAliases: ["remove", "k"],
};
