client.on("message", async (message) => {
  switch (command) {
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
