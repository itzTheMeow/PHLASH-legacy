module.exports = (bot) => {
  bot.Channels = {
    verify: "706739499731910717",
  };

  bot.Embeds = {
    rules: new Discord.RichEmbed()
      .setTitle("Server Rules")
      .setColor(bot.config.color)
      .addField(
        "**1.** No NSFW",
        "No NSFW is allowed in any of the channels. NSFW posted by anyone will result in a kick from our server."
      )
      .addField(
        "**2.**No Racism",
        "No RACISM. Everyone is equal in this server. In the year  2020, racism should not be a thing. Any racist abuse towards anyone will result in a kick from our server."
      )
      .addField(
        "**3.** USE RIGHT CHANNELS",
        "Please use the appropriate channels. The punishment ladder for this rule goes as follows: Warning, Warning, Mute, Kick."
      )
      .addField(
        "**4.** Read Rules!",
        "'I didn't read the rules' is NOT an excuse. Punishment is the same for everyone (including staff) regardless of if you have read the server rules or not."
      )
      .addField(
        "**5.** NO pinging!",
        "Do not ping any of the Devs, Admins, Moderators or Owner unless they have told you to. If you have any questions, just ask and someone will definitely come to your aid. "
      )
      .addField(
        "**6.** NO spamming!",
        "Do not spam. Spamming will result in a warn, then a mute, and then a ban if it is continued. Mass pinging will result in an immediate ban from our server."
      )
      .setFooter(
        "We are glad that you decided to join as a member of PHLAME Development!"
      ),
  };

  bot.Emojis = {
    checkmark: "664324664536989726",
    tick: "664324665082380298",
    x: "664324664482332691",
    customer: "680242224449323054",
    work: "684981957322604566",
    phlame: "706423782402949150",
  };

  bot.Roles = {};
};
