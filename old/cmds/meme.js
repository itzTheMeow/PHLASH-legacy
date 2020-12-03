const Discord = module.require("discord.js");
const nodefetch = require("node-fetch");

module.exports.run = async (bot, message, args, cleanArgs) => {
  let subreddit =
    bot.config.memeSubreddits[Math.floor(Math.random() * bot.config.memeSubreddits.length)] ||
    "memes";

  try {
    await nodefetch("https://www.reddit.com/r/" + subreddit + ".json?sort=top&t=week", {
      query: { limit: 800 },
    })
      .then((res) => res.json())
      .then((body) => {
        const allowed = message.channel.nsfw
          ? body.data.children
          : body.data.children.filter((post) => !post.data.over_18);
        if (!allowed.length)
          return message.channel.send("It seems we are out of fresh memes! Try again later.");

        const randomnumber = Math.floor(Math.random() * allowed.length);
        const embed = new Discord.RichEmbed()
          .setColor(bot.config.color)
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
      });
  } catch (err) {
    console.error(err);
    message.channel.send("An error occurred.");
  }
};
module.exports.help = {
  name: "meme",
  description: "Replies with a meme.",
  usage: "meme",
  type: "fun",
  commandAliases: ["memer"],
};
