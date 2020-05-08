const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
  if (message.author.id !== "521701910609133570") return;
  let code = args.slice(1).join(" ");
  let done = "Nothing 3:";

  try {
    done = eval(code);
  } catch (e) {
    done = e;
  }

  message.channel.send("```js\n" + code + "``````" + done + "```");
};
module.exports.help = {
  name: "eval",
  description: "Evaluates code.",
  usage: "eval [code]",
  type: "admin",
  commandAliases: [],
};
