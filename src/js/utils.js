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

export function extractNameAndPicture(obj) {
  if (obj.kind === 0) {
    const { name, pubKey, picture } = JSON.parse(obj.content);
    caches.open('my-cache').then((cache) => {
      cache.put(pubKey, { name, picture });
    });
  }
}

export function extractNameAndPic(obj) {
  if (obj.kind === 0) {
    const { name, pubKey, picture } = JSON.parse(obj.content);
    caches.open('my-cache').then((cache) => {
      cache.put(pubKey, { name, picture });
    });
    return { name, picture };
  }
}

export function createNoteCardFromCache(obj) {
  if (obj.kind === 1) {
    const pubKey = obj.pubKey;
    const content = obj.content;
    const timestamp = obj.created_at;

    caches.open('my-cache').then((cache) => {
      cache.match(pubKey).then((response) => {
        if (response) {
          const { name, picture } = response;
          createNoteCard(name, picture, content, timestamp);
        } else if (!response) {
          const name = 'Anonymous';
          const picture = 'https://i.imgur.com/3ZmQ2Lw.png';
          createNoteCard(name, picture, content, timestamp);
        }
      });
    });
  }
}
