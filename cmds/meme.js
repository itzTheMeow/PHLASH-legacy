const Discord = module.require("discord.js");
const randomPuppy = require("random-puppy");

module.exports.run = async (bot, message, args, cleanArgs) => {
  let subreddit =
    bot.config.memeSubreddits[
      Math.floor(Math.random() * bot.config.memeSubreddits.length)
    ];

  randomPuppy(subreddit)
    .then(async (url) => {
      message.channel.send({
        files: [
          {
            attachment: url,
            name: "meme.png",
          },
        ],
      });
    })
    .catch((err) => console.error(err));
};
module.exports.help = {
  name: "meme",
  description: "Replies with a meme.",
  usage: "meme",
  type: "",
  commandAliases: ["memer"],
};
