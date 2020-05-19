const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
  if (message.author.id !== "521701910609133570") return; // stop if meow isnt running the command
  let code = args.slice(1).join(" "); // get the code
  let done = "Nothing 3:"; // declare the evaluated code

  let customFunctions = {
    list: () => {
      done =
        "Listing custom commands...\n" +
        Object.keys(customFunctions).join(", "); // get the commands
    },
    syncPermissions: () => {
      let children = message.channel.parent.children; // get the channels in the category
      done = "Syncing permissions of " + children.size + " channels...";
      children.forEach((child) => {
        child.lockPermissions(); // lockPermissions syncs the permissions of a channel
      });
    },
  };

  if (code.startsWith("::")) {
    // if there is a custom command (::command)
    let command = args[1].substring(2); // get the command from the args
    let func = customFunctions[command]; // get the command from the object
    if (func) func();
    // if the command is found, run it
    else done = "Command not found. Try ::list"; // if the command isnt found, say so
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
