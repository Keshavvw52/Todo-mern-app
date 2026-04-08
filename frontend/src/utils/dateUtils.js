export const formatDistanceToNow = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = date - now;
  const absDiff = Math.abs(diff);

  const minutes = Math.floor(absDiff / 60000);
  const hours = Math.floor(absDiff / 3600000);
  const days = Math.floor(absDiff / 86400000);

  if (days > 0) return `${days}d ${diff < 0 ? "ago" : "left"}`;
  if (hours > 0) return `${hours}h ${diff < 0 ? "ago" : "left"}`;
  return `${minutes}m ${diff < 0 ? "ago" : "left"}`;
};