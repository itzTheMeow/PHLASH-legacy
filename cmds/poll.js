const { GuildMember } = require("discord.js");

const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
  let channel = message.mentions.channels.first();
  if (!channel) return message.channel.send("You must specify a channel to send the poll to!");

  if (message.channel.permissionsFor(message.member).has("MENTION_EVERYONE")) {
    let multi = args[2];
    if (multi !== "true" && multi !== "false")
      return message.channel
        .send("Specify if users can choose more than one choice!")
        .then((msg) => msg.delete({ delay: 3000 }));

    let content = args.slice(3).join(" ");
    if (!content) return message.channel.send("Include some text for the poll!");

    message.delete();

    let answers = content.split(" | ");
    let question = answers[0];

    let emojis = [
      "554750237470752779", // A
      "554750238703878153", // B
      "554750239626756116", // C
      "554750239710511153", // D
      "554750239391744020", // E
      "554750239433818132", // F
      "554750240218153006", // G
      "554750239169576961", // H
      "554750239400001538", // I
      "554750239131566088", // J
      "554750239563579413", // K
      "554750239400263681", // L
      "554750240373342228", // M
      "554750239727157269", // N
      "629537200026943488", // O
      "554750239693864960", // P
      "554750240092061737", // Q
      "554750240259833895", // R
      "554750240175947776", // S
      "554750239677087745", // T
    ];

    let items = answers.slice(1, answers.length - 1);

    if (items.length > 20) return message.channel.send("You can not have more than 20 items!");

    let answerArr = [];

    await items.forEach((i) => {
      answerArr.push(`<:_:${emojis[items.indexOf(i)]}> ${i}`);
    });

    let final = {
      question: question.replace(/%|%/g, ""),
      answers: answerArr.join("\n").replace(/%|%/g, ""),
    };

    const embed = new Discord.MessageEmbed()
      .setAuthor("Poll", bot.user.displayAvatarURL())
      .setTitle(`**${final.question}**`)
      .setDescription(final.answers)
      .addField("Note", answers[answers.length - 1]);

    if (multi == "true") embed.setFooter("You can pick multiple choices.");
    if (multi == "false") embed.setFooter("You can only pick one choice.");

    let msg = await channel.send(embed);
    let reactCode = "";
    emojis.forEach((e) => {
      if (emojis.indexOf(e) > answers.length - 3) return;
      reactCode += `await msg.react("${e}");`;
    });
    eval(`(async () => {${reactCode}})();`);

    let activePolls = bot.db.get(`polls_${message.guild.id}`) || [];
    activePolls.push(`${channel.id}:${msg.id}`);
    bot.db.set(`polls_${message.guild.id}`, activePolls);
  } else {
    message.channel.send("You do not have the `MENTION_EVERYONE` permission!");
    return;
  }
};

module.exports.help = {
  name: "poll",
  description: "Send a poll to a specified channel. Separate choices with ` | `.",
  usage: "poll [channel] [multiple-choices?] [title] | [choices] | [note]",
  type: "utility",
  commandAliases: [],
  required: {
    permissions: [],
    roles: [],
    bot: [],
  },
};
