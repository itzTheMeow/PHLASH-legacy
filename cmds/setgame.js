const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  if (message.member.isAdmin()) {
    if (!args[0]) return message.reply(":x: Please specify a game type!");
    let setString = args[0];

    if (!args[1]) {
      message.channel.send(":x: Please specify a game!");
      return;
    }
    let game = args.slice(1).join(" ");

    switch (setString) {
      case "playing":
        bot.user.setActivity(game, { type: "PLAYING" });
        break;
      case "streaming":
        bot.user.setActivity(game, {
          type: "STREAMING",
          url: "https://twitch.tv/meowmeowcatpersonthing",
        });
        break;
      case "listening":
        if (args[1] == "to") game = args.slice(2).join(" ");
        bot.user.setActivity(game, { type: "LISTENING" });
        break;
      case "watching":
        bot.user.setActivity(game, { type: "WATCHING" });
        break;
      default:
        return message.channel.send(":x: Please specify a valid game type.");
    }

    message.channel.send(
      `Changing the game to **${game}** with a gametype of *${setString}*.`
    );
  } else {
    message.reply("you are not a server admin!");
  }
};
module.exports.help = {
  name: "setgame",
  description:
    "Sets the bot's game to one of `playing`, `watching`, `listening`, and `streaming`.",
  usage: "setgame [type] [game]",
  commandAliases: ["game"],
};
