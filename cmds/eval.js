const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
  if (message.author.id !== "521701910609133570") return; // stop if meow isnt running the command
  let code = args.slice(1).join(" "); // get the code
  let done = "Nothing 3:"; // declare the evaluated code

  try {
    done = eval(code); // eval the code
  } catch (e) {
    done = e; // catch any errors
  }

  message.channel.send("```js\n" + code + "``````" + done + "```"); // send the code
};
module.exports.help = {
  name: "eval",
  description: "Evaluates code.",
  usage: "eval [code]",
  type: "admin",
  commandAliases: [],
};
