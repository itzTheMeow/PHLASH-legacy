const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
  if (!bot.config.admins.includes(message.author.id)) return;
  let code = args.slice(1).join(" ");
  let done = "Nothing 3:";

  let customFunctions = {
    list: () => {
      done = "Listing custom commands...\n" + Object.keys(customFunctions).join(", ");
    },
    syncPermissions: () => {
      let children = message.channel.parent.children;
      done = "Syncing permissions of " + children.size + " channels...";
      children.forEach((child) => {
        child.lockPermissions();
      });
    },
  };

  if (code.startsWith("::")) {
    let command = args[1].substring(2);
    let func = customFunctions[command];
    if (func) func();
    else done = "Command not found. Try ::list";
  } else {
    try {
      done = eval(code);
    } catch (e) {
      done = e;
    }
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
