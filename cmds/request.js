const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  if (message.guild.id !== bot.guild.id)
    return message.channel.send(
      "You must use this command in the Phlame Development server!"
    );

  let embed = new Discord.RichEmbed();
  embed.setDescription(
    "Thank you for choosing Phlame Development!\nYou will be asked a few questions about your bot."
  );
  embed.setColor(bot.config.color);
  embed.setFooter("Please answer all questions to the best of your ability.");
  await message.channel.send(embed);
  embed.setFooter('Say "cancel" to cancel your request.');

  let options = {};
  let questionNumber = 0;
  let questions = [];

  Object.keys(bot.request.application).forEach((k) => {
    questions.push({ prop: k, q: bot.request.application[k] });
  });

  let awaitMessagesFilter = (m) =>
    m.author.id == message.author.id &&
    m.channel.id == message.channel.id &&
    !m.author.bot;
  let awaitMessagesSettings = { max: 1, time: 600000, errors: ["time"] };

  function cancelRequest() {
    questionNumber = Infinity;
    message.channel.send("Creation Canceled");
  }
  function finishRequest() {
    message.channel.send(JSON.stringify(options));
  }

  function doQuestion() {
    let question = questions[questionNumber];
    if (!question) finishRequest();

    embed.setDescription(question.q);
    message.channel.send(embed);
    message.channel
      .awaitMessages(awaitMessagesFilter, awaitMessagesSettings)
      .then((msgs) => {
        let msg = msgs.first() || {};
        if (msg.content == "cancel") return cancelRequest();

        let item = msg.content;
        if (!item) return doQuestion();

        options[question.prop] = item;
        questionNumber++;
        doQuestion();
      });
  }
  doQuestion();
};
module.exports.help = {
  name: "request",
  description: "Requests a bot from the server.",
  usage: "request",
  type: "server",
  commandAliases: ["req"],
};
