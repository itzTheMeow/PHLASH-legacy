const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
  if (message.author.id !== "521701910609133570") return; // stop if meow isnt running the command
  let code = args.slice(1).join(" "); // get the code
  let done = "Nothing 3:"; // declare the evaluated code

  let customFunctions = {
    list: () => {
      done =
        "Listing custom commands...\n" +
        Object.keys(customFunctions).join(", ");
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
      done = eval(code); // eval the code
    } catch (e) {
      done = e; // catch any errors
    }
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
