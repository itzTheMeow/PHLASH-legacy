module.exports = function (bot) {
  bot.guilds.cache.forEach((g) => {
    let activePolls = bot.db.fetch(`polls_${g.id}`) || [];
    if (!activePolls.length) return;

    activePolls.forEach(async (p) => {
      let pollChannel = await g.channels.cache.get(p.split(":")[0]);
      if (!pollChannel) return;
      let poll = await pollChannel.messages.fetch(p.split(":")[1]);
      if (!poll) return;
      poll.reactions.cache.map((r) => r.users.fetch());
    });
  });
};
