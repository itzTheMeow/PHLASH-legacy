const Discord = require("discord.js");
const i4h = require("intervals-for-humans");

module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send("You must have `MANAGE_CHANNELS` permission to use this command!");
  let time = args[1];
  if (!time || time.toLowerCase() == "off") time = "0s";
  time = i4h(time);
  if (!time || (time < 1000 && time != 0) || (time / 1000) != Math.floor(time / 1000)) return message.channel.send("That's not a valid time!");
  time = time / 1000;
  if (time > 21600) return message.channel.send("Slowmode can't be longer than 6 hours!");
  try {
    await message.channel.setRateLimitPerUser(time, "Requested by " + message.author.tag + " (ID: " + message.author.id + ")");
  } catch(e) {
    message.channel.send("An error occurred when setting slowmode. Please check my permissions and try again.");
    return;
  }
  if (time == 0) {
    message.channel.send("I have turned off slowmode in this channel!");
  } else {
    message.channel.send("I have set slowmode for this channel!!");
  }
};

module.exports.help = {
  name: "slowmode",
  description: "Sets slowmode in the current channel.",
  usage: "slowmode [time]",
  type: "utility",
  commandAliases: [ "setslowmode", "slow", "sm" ]
};
