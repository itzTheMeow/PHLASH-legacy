const Discord = require("discord.js");

module.exports = (bot) => {
  let request = {};

  request.application = {
    name: "What do you want your bot to be called?",
    description: "Describe what you want your bot to do.",
    prefix: "What do you want your bot's prefix to be?",
    budget: "How much would you like to pay for your bot?",
    extra: "Do you have any additional information for us about your bot?",
    time: "How long do you want to wait for your bot?",
    host: "Would you like us to host your bot for you or will you self-host?",
  };
  request.terms = {
    name: "Bot Name",
    description: "Description of Bot",
    prefix: "Prefix",
    budget: "Budget",
    extra: "Extra Information",
    time: "Timeframe",
    host: "Hosting",
  };

  request.getEmbed = function (bot, member, options) {
    let appEmbed = new Discord.RichEmbed();
    appEmbed.setAuthor(
      `Bot Request from ${member.user.tag}`,
      member.user.displayAvatarURL
    );
    appEmbed.setColor(bot.config.color);
    appEmbed.setTitle(options.name || "Unknown");
    appEmbed.setFooter("React with the emojis to accept this request.");
    Object.keys(request.application).forEach((a) => {
      appEmbed.addField(request.terms[a], options[a] || "Unknown");
    });
    return appEmbed;
  };

  bot.request = request;
};