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

// function extractNameAndPicSetToLocalStorage(obj) {
//   if (obj.kind === 0) {
//     const { name, pubkey, picture } = JSON.parse(obj.content);
//     localStorage.setItem(pubkey, JSON.stringify({ name, picture }));
//   }
// }

// Extract profile data to the local storage

export function extractAndStoreData(obj) {
  // Parse the content field of the object
  const data = JSON.parse(obj.content);

  // Extract the name, website, nip05, and picture url from the parsed data
  const { name, website, nip05, picture } = data;

  // Store the extracted data under the pubkey in localStorage
  localStorage.setItem(
    obj.pubkey,
    JSON.stringify({ name, website, nip05, picture })
  );
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

// check for different types of events
export function getDifferentKindOfEvents(relay) {
  sub.on('event', (event) => {
    if (event.kind === 0) {
      console.log('this is a type 0 event', event);
    } else if (event.kind === 1) {
      console.log('this is a type 1 event', event);
      createNoteCard(event);
    }
    resolve(event);
  });

  sub.on('eose', () => {
    sub.unsub();
  });
}
