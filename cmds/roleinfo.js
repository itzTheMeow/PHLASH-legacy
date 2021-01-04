const Discord = require("discord.js");

const extr = require("tcc-cdn");
let texttools = extr('texttools');
texttools.use();

module.exports.run = async (client, message, args) => {
  if (!args[1]) return message.channel.send("Please specify a role to show info on!");
  let role = message.mentions.roles.first();
  if (!role) {
    role = message.guild.roles.cache.filter(role => role.name.toLowerCase().includes(args.slice(1).join(" ").toLowerCase()));
    if (role.size == 0) return message.channel.send("I can't find any roles that match that search!");
    if (role.size >= 2) return message.channel.send("Hmm... I found multiple results for that role. Try being more specific?");
    role = role.first();
  }
  let mentionable = role.mentionable ? "Yes" : "No"
  let hoisted = role.hoisted ? "Yes" : "No"
  let permissions = role.permissions.serialize();
  let permissionsArray = [];
  for (let key in permissions) {
    if (permissions.hasOwnProperty(key)) {
      if (permissions[key] == true) permissionsArray.push(key.split("_").join(" ").toTitleCase());
    }
  }
  permissions = permissionsArray.join(", ");
  if (permissions == "") permissions = "None";
  let infoEmbed = new Discord.MessageEmbed()
    .setAuthor(role.name + " (" + role.id + ")")
    .setColor(role.hexColor)
    .addField("Mentionable?", mentionable, true)
    .addField("Hoisted?", hoisted, true)
    .addField("Hex Color", "`" + role.hexColor + "`", true)
    .addField("Members", role.members.size.toLocaleString(), true) // this uses cache, so not sure if you want to remove it or not
    .addField("Permissions", permissions, true)
    .setFooter("Created at ")
    .setTimestamp(role.createdTimestamp);
  message.channel.send(infoEmbed);
};

module.exports.help = {
  name: "roleinfo",
  description: "Gives you info about a role.",
  usage: "roleinfo [role]",
  type: "utility",
  comandAliases: [ "ri", "role" ]
};
