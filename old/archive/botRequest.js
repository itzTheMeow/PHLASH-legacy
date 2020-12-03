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
  request.footers = {
    pendingRequest: "React with the emojis to accept this request.",
    pendingCompletion: "React to complete or cancel the request.",
  };
  request.channels = {
    requests: "704771790806974557",
    requestsCategory: "716023962613710888",
    archivedCategory: "710249330740691056",
  };

  request.getEmbed = function (bot, member, options, NEW) {
    let footer = NEW
      ? bot.request.footers.pendingCompletion
      : bot.request.footers.pendingRequest;

    let appEmbed = new Discord.RichEmbed();
    appEmbed.setAuthor(
      `Bot Request from ${member.user.tag}`,
      member.user.displayAvatarURL
    );
    appEmbed.setColor(bot.config.color);
    appEmbed.setFooter(footer);
    Object.keys(request.application).forEach((a) => {
      appEmbed.addField(request.terms[a] || "Unknown", options[a] || "Unknown");
    });
    return appEmbed;
  };

  request.sendEmbed = async function (bot, channel, member, embed, NEW) {
    let botRequest = await channel.send(
      `Request from ${member} in ${channel}!`,
      {
        embed: embed,
      }
    );
    await botRequest.react(bot.Emojis.checkmark);
    await botRequest.react(bot.Emojis.x);

    let currentRequests = bot.db.fetch("requests") || [];
    currentRequests.push(botRequest.id);
    bot.db.set("requests", currentRequests);

    return botRequest;
  };

  request.createChannel = async function (bot, member, botName) {
    let reqChannel = await bot.guild.createChannel(botName || "unknown-bot", {
      type: "text",
      topic: `Test`,
      position: 9999,
      parent: bot.request.channels.requestsCategory,
      permissionOverwrites: [
        { id: bot.guild.id, deny: ["READ_MESSAGES"] },
        { id: member.id, allow: ["READ_MESSAGES"] },
      ],
    });

    return reqChannel;
  };

  request.newRequest = async function (bot, member, options) {
    let newE = request.getEmbed(bot, member, options, true);
    let oldE = request.getEmbed(bot, member, options, false);

    let channel = await request.createChannel(bot, member, options.name);
    let message = await bot.request.sendEmbed(bot, channel, member, newE, true);
    let requests = bot.guild.channels.get(request.channels.requests);
    await bot.request.sendEmbed(bot, requests, member, oldE, false);
  };

  bot.request = request;
};
