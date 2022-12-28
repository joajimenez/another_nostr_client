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
    const { name, pubkey, picture } = JSON.parse(obj.content);
    caches.open('my-cache').then((cache) => {
      cache.put(pubkey, { name, picture }); // store name and picture directly in cache
    });
    console.log('name and picture extracted', name, picture);
  }
}

export function createNoteCardFromCache(obj) {
  if (obj.kind === 1) {
    const pubKey = obj.pubKey;
    const content = obj.content;
    const timestamp = obj.created_at;
    const name = 'Anon';
    const picture = 'https://i.pravatar.cc/150'; // define picture here

    caches.open('my-cache').then((cache) => {
      cache.match(pubKey).then((response) => {
        if (response) {
          const { name, picture } = response; // retrieve name and picture directly from response
          createNoteCard(name, picture, content, timestamp);
          console.log('yes response');
        } else if (!response) {
          createNoteCard(name, picture, content, timestamp);
          console.log('no response');
        }
      });
    });
  }
}

// let create the note cards
async function createNoteCard(name, picture, content, timestamp) {
  const noteCard = document.createElement('div');
  noteCard.classList.add('note-card');
  noteCard.innerHTML = `
      <div class="note-card-header">
          <div class="note-profile-picture">
          <img
              src="${picture}"
              alt="profile picture"
              class="profile-pic"
          />
          </div>
          <p class="note-profile-username username-el note-title"> ${name}</p>

           <p class="note-date gray-font"> • ${formatTimeElapsed(
             timestamp + '000'
           )}</p>

           <span class="material-symbols-outlined note-more-menu">
more_horiz
</span>
      </div>
      <div class="note-body">
      ${content}
      </div>
      <hr>
      <div class="note-card-footer">
          <div class="note-comments footer-icon">
          <span class="material-symbols-outlined"> chat_bubble </span>
          </div>

          <div class="note-likes footer-icon">
          <span class="material-symbols-outlined"> favorite </span>
          </div>

          <div class="note-share footer-icon">
          <span class="material-symbols-outlined"> share </span>
          </div>

          <div class="note-bolt footer-icon">
          <span class="material-symbols-outlined">
          bolt
          </span>
          </div>

          <div class="note-share footer-icon">
      </div>
      `;
  document.querySelector('.notes-container').prepend(noteCard);
}
