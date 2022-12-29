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

export function createNoteCard(event) {
  const storedData = localStorage.getItem(event.pubkey);

  if (storedData) {
    const { name, picture } = JSON.parse(storedData);
    // console.log('name', name);
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
                event.created_at + '000'
              )}</p>
   
              <span class="material-symbols-outlined note-more-menu">
   more_horiz
   </span>
         </div>
         <div class="note-body">
         ${event.content}
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
    document.querySelector('.notes-feed').appendChild(noteCard);

    console.log('SUCCESS! created with stored data');
    // console.log(storedData);
  } else {
    const noteCard = document.createElement('div');
    const shortenedPubkey = event.pubkey.substring(0, 7);
    noteCard.classList.add('note-card');
    noteCard.innerHTML = `
          <div class="note-card-header">
              <div class="note-profile-picture">
              <img
                  src="https://avatars.dicebear.com/api/big-smile/${
                    event.pubkey
                  }.svg"
                  alt="profile picture"
                  class="profile-pic"
              />
              </div>

              <p class="note-profile-username username-el note-title"> ${shortenedPubkey}</p>
              
              <p class="note-date gray-font"> • ${formatTimeElapsed(
                event.created_at + '000'
              )}</p>
   
              <span class="material-symbols-outlined note-more-menu">
   more_horiz
   </span>
         </div>
         <div class="note-body">
         ${event.content}
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
    document.querySelector('.notes-feed').appendChild(noteCard);
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
