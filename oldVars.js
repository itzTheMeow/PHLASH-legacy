const Discord = require("discord.js");

module.exports = (bot) => {
  bot.Channels = {
    welcome: "744301603737174098",
  };

  bot.Embeds = {
    rules: new Discord.RichEmbed()
      .setTitle("Server Rules")
      .setColor(bot.config.color)
      .addField(
        "**1.** No NSFW",
        "No NSFW is allowed in any of the channels. NSFW posted by anyone will result in a kick or ban from our server. (KB)"
      )
      .addField(
        "**2.** No Racism",
        "No RACISM. Everyone is equal in this server. Any racist abuse towards anyone will result in a kick from our server. (MKB)"
      )
      .addField(
        "**3.** Use Correct Channels",
        "Please use the appropriate channels. Only use a channel for its intended purpose. (WWKB)"
      )
      .addField(
        "**4.** Read the Rules",
        '"I didn\'t read the rules" is NOT an excuse. Punishment is the same for everyone (including staff) regardless of if you have read the server rules or not.'
      )
      .addField(
        "**5.** No Uneccesary Pinging!",
        "Do not ping any of the staff members unless they have told you to, or there is an emergency. If you have any questions, just ask and someone will come to your aid. (WMKB)"
      )
      .addField(
        "**6.** No Spamming!",
        "Do not spam. Mass pinging will result in an immediate ban from our server. (WMMKB)"
      )
      .addField(
        "Punishment Ladders",
        "The punishment ladders for each rule are listed after the description. For example if the punishment ladder is `WMKB`, that means **w**arn, **m**ute, **k**ick, then **b**an."
      )
      .setFooter("We are glad that you decided to become a member of Leafy Development!"),
  };

  bot.Emojis = {
    checkmark: "742286552616403034",
    tick: "742286552448761906",
    xmark: "742286551735861350",
    paypal: "742286552394367017",
    patreon: "742286552687706152",
    logo: "",
  };

  bot.Roles = {
    pings: {
      giveaways: "744431699718438922",
      polls: "744431711051579442",
      updates: "744431713169571871",
    },
    colors: {},
    languages: {
      c: "728331958295330817",
      cSharp: "728331719941292152",
      cPlusPlus: "728331719220002827",
      HTMLCSS: "728354060305956865",
      java: "728331718775275538",
      javascript: "728331677121904761",
      lua: "728356455249477661",
      PHP: "728356456067498047",
      python: "728331718175621220",
      sql: "728356641052819600",
    },
  };
};
