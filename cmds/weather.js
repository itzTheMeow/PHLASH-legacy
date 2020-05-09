const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, cleanArgs) => {
  let degree = args[1] || "C";
  let loc = args.slice(2).join(" ") || "";
  if ((args[1] || "").length > 1) {
    degree = "C";
    loc = args.slice(1).join(" ");
  } else {
    switch ((args[1] || "").toUpperCase()) {
      case "F":
        degree = "F";
        break;
      case "C":
        degree = "c";
        break;
      default:
        degree = "C";
    }
  }

  require("weather-js").find({ search: loc, degreeType: degree }, function (
    err,
    result
  ) {
    if (err) return message.channel.send(err);
    if (!result.length)
      return message.channel.send("Please enter a valid location.");

    var current = result[0].current;
    var location = result[0].location;

    const weatherEmbed = new Discord.RichEmbed()
      .setAuthor(`Weather for ${current.observationpoint}`)
      .setTitle(current.skytext)
      .setThumbnail(current.imageUrl)
      .addField("Timezone", `${location.timezone} (UTC)`, true)
      .addField("Degree Type", location.degreetype, true)
      .addField("Temperature", `${current.temperature}°`, true)
      .addField("Feels Like", `${current.feelslike}°`, true)
      .addField("Winds", current.winddisplay, true)
      .addField("Humidity", `${current.humidity}%`, true)
      .setColor(bot.config.color);

    message.channel.send(weatherEmbed);
  });
};
module.exports.help = {
  name: "weather",
  description: "Fetches the weather in a certain location",
  usage: "weather <degree-type> [location]",
  type: "fun",
  commandAliases: [],
};
