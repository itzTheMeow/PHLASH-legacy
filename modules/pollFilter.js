module.exports = (r, u) => {
  if (u.bot) return;
  let message = r.message;

  if (((message.embeds[0] || {}).footer || {}).text !== "You can only pick one choice.") return;

  if (message.reactions.cache.filter((r) => r.users.cache.has(u.id)).size > 1) r.users.remove(u);
};
