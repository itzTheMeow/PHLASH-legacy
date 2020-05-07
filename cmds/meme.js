const Discord = module.require("discord.js");
const snekfetch = require("snekfetch");

module.exports.run = async (bot, message, args, cleanArgs) => {
  let subreddit =
    bot.config.memeSubreddits[
      Math.floor(Math.random() * bot.config.memeSubreddits.length)
    ];

  try {
    const { body } = await snekfetch
      .get("https://www.reddit.com/r/" + subreddit + ".json?sort=top&t=week")
      .query({ limit: 800 });
    const allowed = message.channel.nsfw
      ? body.data.children
      : body.data.children.filter((post) => !post.data.over_18);
    if (!allowed.length)
      return message.channel.send(
        "It seems we are out of fresh memes! Try again later."
      );
    const randomnumber = Math.floor(Math.random() * allowed.length);
    const embed = new Discord.RichEmbed()
      .setColor(0x00a2e8)
      .setTitle("**" + allowed[randomnumber].data.title + "**")
      .setURL("https://reddit.com" + allowed[randomnumber].data.permalink)
      .setDescription("by " + allowed[randomnumber].data.author)
      .setImage(allowed[randomnumber].data.url)
      .setFooter(
        "⬆ " +
          allowed[randomnumber].data.ups +
          " | 💬 " +
          allowed[randomnumber].data.num_comments
      );
    message.channel.send(embed);
  } catch (err) {
    return console.log(err);
  }
};
module.exports.help = {
  name: "meme",
  description: "Replies with a meme.",
  usage: "meme",
  type: "",
  commandAliases: ["memer"],
};
