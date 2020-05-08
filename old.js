let startup = Date.now();

const Emojis = {
  done: "<:Done:664324664536989726>",
  pending: "<:Pending:664324665082380298>",
  notpossible: "<:NotPossible:664324664482332691>",
  logo: "<:PhantomCreators:669365062489866251>",
  enquire: "<:Enquire:680254554180288521>",
  customer: "<:Customer:680242224449323054>",
  work: "<:Work:684981957322604566>",
  phlame: "<:phlame:706423782402949150>",
};

client.on(`message`, function (message) {
  if (message.channel.name === "verify") {
    if (message.content === "verify") {
      var verifyRole = message.member.guild.roles.find("name", "Casual");
      var role = message.member.guild.roles.find("name", "Verify");
      message.member.removeRole(role);
      message.member.addRole(verifyRole);
      message.author.send({
        embed: {
          color: 0xfd0000,
          title: "Phlame Development",
          description: `You have been Verified `,
          footer: {
            text: "Phlash",
          },
          timestamp: new Date(),
        },
      });
      message.delete();
    } else message.delete();
  }
});

client.on("message", async (message) => {
  switch (command) {
    case "newbie":
    case "newmembers":
      message.delete();
      let newbieEmbed = new Discord.RichEmbed()
        .setTitle("New Member Things")
        .setColor(config.color)
        .addField(
          "**•** Customer",
          "If you joined this server because you want a custom bot or any of our services, react with <:Customer:680242224449323054> for the **Customer Role**."
        )
        .addField(
          "**•** Enquiry",
          "Is there something you need to enquire about any of our products or who we are? React with <:Enquire:680243104712097981> for the **Enquiry Role**."
        )
        .addField(
          "**•** Work",
          "You think you have what it takes to become a developer in our server? React with <:Work:684981957322604566> for the **Work Role**, talk to one of the heads of the server and we will get you on the way to becoming a Phantom Developer!"
        )
        .setFooter(
          "We are glad that you decided to become a part of the Phantom Creators! Please do respect others!"
        );
      message.channel.send(newbieEmbed).then(async (embedMessage) => {
        await embedMessage.react(":Customer:680242224449323054");
        await embedMessage.react(":Enquire:680243104712097981");
        await embedMessage.react(":Work:684981957322604566");
      });
      break;
    case "weather":
      weather.find({ search: args.join(" "), degreeType: "C" }, function (
        err,
        result
      ) {
        if (err) return message.channel.send(err);
        if (result.length === 0)
          return message.channel.send("Please enter a valid location.");

        var current = result[0].current;
        var location = result[0].location;

        const weatherEmbed = new Discord.RichEmbed()
          .setDescription(`**${current.skytext}**`)
          .setAuthor(`Weather for ${current.observationpoint}`)
          .setThumbnail(current.imageUrl)
          .setColor(0x00ae86)
          .addField("Timezone", `UTC${location.timezone}`, true)
          .addField("Degree Type", location.degreetype, true)
          .addField("Temperature", `${current.temperature} Degrees`, true)
          .addField("Feels Like", `${current.feelslike} Degrees`, true)
          .addField("Winds", current.winddisplay, true)
          .addField("Humidity", `${current.humidity}%`, true);
        message.channel.send(weatherEmbed);
      });
      break;
    case "server":
    case "serverinfo":
    case "si":
      message.channel.send(
        `**Server Name:** ${message.guild.name}\n**Total Members:** ${message.guild.memberCount}`
      );
      break;
    case "rules":
      message.channel.send(Embeds.rules.setThumbnail(message.guild.iconURL));
      break;
    case "request-bot":
    case "apply-bot":
    case "request":
      if ((Cooldowns[message.author.id].lastReq || Date.now()) <= Date.now()) {
        let reqEmbed = new Discord.RichEmbed();
        if (message.channel.type !== "dm") return;
        const botRequest = new Discord.RichEmbed();
        botRequest.setColor(config.color);
        botRequest.setFooter(
          "Please answer all questions with enough information."
        );

        if (message.channel.type !== "dm") return;
        botRequest.setDescription(
          "Thank you for requesting a bot! I will ask you a few questions.\nSay `cancel` at any time to cancel your application."
        );
        message.author.send(botRequest);

        setTimeout(function () {
          botRequest.setDescription(
            "**1.** What do you want your bot to be called?"
          );
          botRequest.setFooter("");
          message.channel.send(botRequest);
        }, 500);

        let q = 1;
        let app = {};

        async function finish() {
          let block = new Discord.RichEmbed()
            .setDescription("Bot request from " + message.author)
            .setColor(config.color);

          Object.keys(app).forEach((a) => {
            let m = app[a];
            block.addField(a, m);
          });

          let botU = message.author;

          let botN =
            app["What do you want your bot to be called?"] || "Unknown Bot";

          let botCreating = await client.channels
            .get("635554507379572739")
            .send("<a:working:649775184546496517> Creating Category...");

          let botC = await client.guild.createChannel(botN, {
            type: "category",
            permissionOverwrites: [
              { id: client.guild.id, deny: ["READ_MESSAGES"] },
              { id: botU.id, allow: ["READ_MESSAGES"] },
            ],
            position:
              client.guild.channels.filter((ch) => ch.type == "category").size -
              4,
          });
          botCreating.edit(
            "<a:working:649775184546496517> Creating Request Channel..."
          );

          let botReqC = await client.guild.createChannel(botN + "-req", {
            type: "text",
            parent: botC,
          });
          await botReqC.lockPermissions();
          await botReqC.edit({
            permissionOverwrites: [
              { id: client.guild.id, deny: ["READ_MESSAGES", "SEND_MESSAGES"] },
              { id: botU.id, allow: ["READ_MESSAGES"] },
            ],
          });
          await botReqC.send(block);
          botCreating.edit(
            "<a:working:649775184546496517> Creating Text Channel..."
          );

          let botTextC = await client.guild.createChannel(botN + "-chat", {
            type: "text",
            parent: botC,
          });
          await botTextC.lockPermissions();
          botCreating.edit(
            "<a:working:649775184546496517> Creating Commands Channel..."
          );

          let botCommandsC = await client.guild.createChannel(
            botN + "-commands",
            {
              type: "text",
              parent: botC,
            }
          );
          await botCommandsC.lockPermissions();
          botCreating.edit(
            "<:Done:664324664536989726> Done! " + botTextC.toString()
          );

          botTextC.send(
            botU +
              ", we have received your request for " +
              botN +
              ". We will be with you shortly."
          );

          block.setDescription(
            "Bot request from " + message.author + ".\nChannel: " + botReqC
          );
          client.channels.get("635554507379572739").send(block);
          client.channels
            .get("635554507379572739")
            .send("@everyone")
            .then((msg) => {
              msg.delete();
            });
        }

        const collector = new Discord.MessageCollector(
          message.channel,
          (m) => m.author.id === message.author.id,
          { time: 3000000 }
        );

        collector.on("collect", (msg) => {
          if (msg.content == "cancel") {
            q = 0;
            botRequest.setDescription(":x: Canceled your request!");
            message.channel.send(botRequest);
          } else if (q == 1) {
            app["What do you want your bot to be called?"] = msg.content;

            q = 2;
            botRequest.setDescription(
              "**2.** Describe what you want your bot to do."
            );
            message.channel.send(botRequest);
          } else if (q == 2) {
            app["Describe what you want your bot to do."] = msg.content;

            q = 3;
            botRequest.setDescription(
              "**3.** What do you want your bot's prefix to be? (the thing used before the command)"
            );
            message.channel.send(botRequest);
          } else if (q == 3) {
            app["What do you want your bot's prefix to be?"] = msg.content;

            q = 4;
            botRequest.setDescription(
              "**4.** How much would you like to pay for your bot? (in USD)"
            );
            message.channel.send(botRequest);
          } else if (q == 4) {
            app["How much would you like to pay for your bot?"] = msg.content;

            q = 5;
            botRequest.setDescription(
              "**5.** Do you have any additional information for us about your bot?"
            );
            message.channel.send(botRequest);
          } else if (q == 5) {
            app[
              "Do you have any additional information for us about your bot?"
            ] = msg.content;

            q = 6;
            botRequest.setDescription(
              "**6.** How long do you want to wait for your bot?"
            );
            message.channel.send(botRequest);
          } else if (q == 6) {
            app["How long do you want to wait for your bot?"] = msg.content;

            q = 7;
            botRequest.setDescription(
              "**7.** Would you like us to host your bot for you, or will you self-host? Prices can be viewed on our website!"
            );
            message.channel.send(botRequest);
          } else if (q == 7) {
            app[
              "Would you like us to host your bot for you or will you self-host?"
            ] = msg.content;

            q = 0;
            botRequest.setDescription(
              "Thank you for choosing the Phantom Creators! Your request has been sent off for review."
            );
            message.channel.send(botRequest);
            finish();
          }
        });

        Cooldowns[message.author.id].lastReq = Date.now() + 600000;
      } else {
        message.reply("You are making too many requests, try again later.");
      }
      break;
    case "dev":
    case "apply-dev":
      if (message.channel.type != "dm") return;
      /* enter app */
      //if (client.guild.members.get(message.author.id).roles.has("633871673463930880")) return message.channel.send("You're a customer. Now you can go on to apply for a bot.");
      /* if user already has staff role */
      /* early break */
      const embed = new Discord.RichEmbed();
      embed.setColor(client.color);
      embed.setFooter("Please answer all questions.");
      /* create embed */

      if (message.channel.type !== "dm") return;
      embed.setDescription(
        "Thank you for applying to become a Phantom Developer! I will ask you a few questions.\nSay `cancel` at any time to cancel your application."
      );
      message.author.send(embed);
      /* send welcome embed */

      setTimeout(function () {
        embed.setDescription(
          "**1.** Is there any particular reason why you want to be a Phantom Developer?"
        );
        embed.setFooter("");
        message.channel.send(embed);
      }, 1000);
      console.log(
        message.author.username + "is submitting a request to be a Phantom Dev."
      );
      /* create and send first question */

      let q = 1;
      let app = [];
      /* create global variables */

      function finish() {
        /* finish function */
        let codeBlock = "```diff\n" + app.join("\n\n") + "```";
        /* create code block with application */
        client.channels
          .get("668810642152488960")
          .send(
            message.author.username +
              "\n" +
              codeBlock +
              "<@197106036899971072> <@609286417981505557> <@521701910609133570>"
          );
        /* send to app review channel */
        //client.channels.get("632360059761983531").send(message.author.username + "\n" + codeBlock);
        /* log the app */
      }

      // This is your collector. It is set to expire after 30 seconds, but you can change that.
      // The filter is set to only accept messages from the one user, and only in the channel it is sent in.
      const collector = new Discord.MessageCollector(
        message.channel,
        (m) => m.author.id === message.author.id,
        { time: 3000000 }
      );

      collector.on("collect", (msg) => {
        /* enter answers */
        if (msg.content == "cancel") {
          q = 0;
          embed.setDescription(
            ":negative_squared_cross_mark: Canceled your application!"
          );
          message.channel.send(embed);
          return;
          /* cancel */
        }
        if (q == 1) {
          app.push(
            "+Is there any particular reason why you want to be a Phantom Developer?"
          );
          app.push(msg.content);

          q = 2;
          embed.setDescription(
            "**2.** Briefly describe what you will be bringing to the team. :exclamation: Please give the main points!"
          );
          message.channel.send(embed);
          return;
        }
        /* question 1-6 */
        if (q == 2) {
          app.push(
            "+Briefly describe what you will be bringing to the team. :exclamation: Please give the main points!"
          );
          app.push(msg.content);

          q = 3;
          embed.setDescription(
            "**3.** Are there any projects you have already worked on?"
          );
          message.channel.send(embed);
          return;
        }
        if (q == 3) {
          app.push("+Are there any projects you have already worked on?");
          app.push(msg.content);

          q = 4;
          embed.setDescription(
            "**4.** If yes, please give us the link to Github or Glitch project."
          );
          message.channel.send(embed);
          return;
        }
        if (q == 4) {
          app.push(
            "+If yes, please give us the link to Github or Glitch project."
          );
          app.push(msg.content);

          q = 5;
          embed.setDescription(
            "**5.** Please give us your **Discord Name and Tag**"
          );
          message.channel.send(embed);
          return;
        }
        if (q == 5) {
          app.push("+Please give us your Discord Name and Tag");
          app.push(msg.content);

          q = 0;
          embed.setDescription(
            "Thank you for applying! Your application has been sent off for review!"
          );
          message.channel.send(embed);
          return finish();
        }
        console.log(
          message.author.username + "submitted a request to be a Phantom Dev."
        );
      });
      break;

    case "channel":
    case "ch":
    case "createchannel":
    case "createch":
    case "newbot":
      if (!message.member.isStaff())
        return message.channel.send("You can not use this command.");

      let botU = message.mentions.members.first();
      if (!botU)
        return message.channel.send(
          "Specify a user to create the bot channels for."
        );

      let botN = args.slice(1).join(" ") || "Unknown Bot";

      let botCreating = await message.channel.send(
        "<a:working:649775184546496517> Creating Category..."
      );

      let botC = await client.guild.createChannel(botN, {
        type: "category",
        permissionOverwrites: [
          { id: client.guild.id, deny: ["READ_MESSAGES"] },
          { id: botU.id, allow: ["READ_MESSAGES"] },
        ],
        position:
          client.guild.channels.filter((ch) => ch.type == "category").size - 4,
      });
      botCreating.edit(
        "<a:working:649775184546496517> Creating Request Channel..."
      );

      let botReqC = await client.guild.createChannel(botN + "-req", {
        type: "text",
        parent: botC,
      });
      await botReqC.lockPermissions();
      await botReqC.edit({
        permissionOverwrites: [
          { id: client.guild.id, deny: ["READ_MESSAGES"] },
          { id: botU.id, allow: ["READ_MESSAGES"] },
          { id: client.guild.id, deny: ["SEND_MESSAGES"] },
        ],
      });
      botCreating.edit(
        "<a:working:649775184546496517> Creating Text Channel..."
      );

      let botTextC = await client.guild.createChannel(botN + "-chat", {
        type: "text",
        parent: botC,
      });
      await botTextC.lockPermissions();
      botCreating.edit(
        "<a:working:649775184546496517> Creating Commands Channel..."
      );

      let botCommandsC = await client.guild.createChannel(botN + "-commands", {
        type: "text",
        parent: botC,
      });
      await botCommandsC.lockPermissions();
      botCreating.edit(
        "<:Done:664324664536989726> Done! " + botTextC.toString()
      );

      botTextC.send(
        botU +
          ", we have received your request for " +
          botN +
          ". We will be with you shortly."
      );
      break;
  }
});

client.login(config.token);
