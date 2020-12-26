module.exports = function (bot) {
  bot.guilds.cache.forEach((g) => {
    let activePolls = bot.db.fetch(`polls_${g.id}`) || [];
    if (!activePolls.length) return;

    activePolls.forEach((p) => {
      let pollChannel = g.channels.cache.get(p.split(":")[0]);
      if (!pollChannel) return;
      let poll = pollChannel.messages.fetch(p.split(":")[1]);
      if (!poll) return;
    });
  });
};
