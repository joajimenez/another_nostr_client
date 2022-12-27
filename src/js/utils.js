export function formatTimeElapsed(timestamp) {
  const elapsed = Date.now() - timestamp;

  if (elapsed < 60000) {
    return `${Math.round(elapsed / 1000)}s ago`;
  } else if (elapsed < 3600000) {
    return `${Math.round(elapsed / 60000)}m ago`;
  } else if (elapsed < 86400000) {
    return `${Math.round(elapsed / 3600000)}h ago`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
}
