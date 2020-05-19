module.exports = (bot) => {
  bot.on("message", (message) => {
    if (message.channel.id !== bot.Channels.verify) return;
    if (message.content !== "verify")
      message.channel
        .send("You must type `verify` in this channel!")
        .then((m) => m.delete(4500));

    message.member.removeRole(bot.Roles.verify);
    message.member.addRole(bot.Roles.casual);
    message.delete();
  });
};
