export function formatTimeElapsed(timestamp) {
  const elapsed = Date.now() - parseInt(timestamp);

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

// Create note card
export function createNoteCard(event) {
  const storedData = localStorage.getItem(event.pubkey);
  let imgUrl = checkForImgUrlInString(event.content);

  if (storedData) {
    let { name, picture } = JSON.parse(storedData);

    if (picture === undefined || picture === null) {
      picture = `https://avatars.dicebear.com/api/big-smile/${event.pubkey}.svg`;
    }

    const noteCard = document.createElement('div');
    noteCard.classList.add('note-card');

    const header = document.createElement('div');
    header.classList.add('note-card-header');

    const profilePicture = document.createElement('div');
    profilePicture.classList.add('note-profile-picture');
    const img = document.createElement('img');
    img.src = picture;
    img.alt = 'profile picture';
    img.loading = 'lazy';
    img.classList.add('profile-pic');
    profilePicture.appendChild(img);
    header.appendChild(profilePicture);

    const username = document.createElement('p');
    username.classList.add(
      'note-profile-username',
      'username-el',
      'note-title'
    );
    username.textContent = name;
    header.appendChild(username);

    const date = document.createElement('p');
    date.classList.add('note-date', 'gray-font');
    date.textContent = `• ${formatTimeElapsed(event.created_at + '000')}`;
    header.appendChild(date);

    const moreMenu = document.createElement('span');
    moreMenu.classList.add('material-symbols-outlined', 'note-more-menu');
    moreMenu.textContent = 'more_horiz';
    header.appendChild(moreMenu);

    noteCard.appendChild(header);

    const body = document.createElement('div');
    body.classList.add('note-body');

    body.textContent = event.content;
    if (imgUrl) {
      const bodyImg = document.createElement('img');
      bodyImg.classList.add('note-body-img');
      bodyImg.src = imgUrl;
      body.appendChild(bodyImg);
    }

    noteCard.appendChild(body);

    const hr = document.createElement('hr');
    noteCard.appendChild(hr);

    const footer = document.createElement('div');
    footer.classList.add('note-card-footer');

    const comments = document.createElement('div');
    comments.classList.add('note-comments', 'footer-icon');
    const commentsIcon = document.createElement('span');
    commentsIcon.classList.add('material-symbols-outlined');
    commentsIcon.textContent = 'chat_bubble';
    comments.appendChild(commentsIcon);
    footer.appendChild(comments);

    const likes = document.createElement('div');
    likes.classList.add('note-likes', 'footer-icon');
    const likesIcon = document.createElement('span');
    likesIcon.classList.add('material-symbols-outlined');
    likesIcon.textContent = 'favorite';
    likes.appendChild(likesIcon);
    footer.appendChild(likes);

    const share = document.createElement('div');
    share.classList.add('note-share', 'footer-icon');
    const shareIcon = document.createElement('span');

    shareIcon.classList.add('material-symbols-outlined');
    shareIcon.textContent = 'share';
    share.appendChild(shareIcon);
    footer.appendChild(share);

    const bolt = document.createElement('div');
    bolt.classList.add('note-bolt', 'footer-icon');
    const boltIcon = document.createElement('span');
    boltIcon.classList.add('material-symbols-outlined');
    boltIcon.textContent = 'bolt';
    bolt.appendChild(boltIcon);
    footer.appendChild(bolt);

    noteCard.appendChild(footer);

    document.querySelector('.notes-feed').appendChild(noteCard);

    // console.log('Note card created');
  } else {
    const noteCard = document.createElement('div');
    noteCard.classList.add('note-card');

    const header = document.createElement('div');
    header.classList.add('note-card-header');

    const profilePicture = document.createElement('div');
    profilePicture.classList.add('note-profile-picture');
    const img = document.createElement('img');
    img.src = `https://avatars.dicebear.com/api/big-smile/${event.pubkey}.svg`;
    img.alt = 'profile picture';
    img.loading = 'lazy';
    img.classList.add('profile-pic');
    profilePicture.appendChild(img);
    header.appendChild(profilePicture);

    const shortenedPubkey = event.pubkey.substring(0, 7);
    const username = document.createElement('p');
    username.classList.add(
      'note-profile-username',
      'username-el',
      'note-title'
    );
    username.textContent = shortenedPubkey;
    header.appendChild(username);

    const date = document.createElement('p');
    date.classList.add('note-date', 'gray-font');
    date.textContent = `• ${formatTimeElapsed(event.created_at + '000')}`;
    header.appendChild(date);

    const moreMenu = document.createElement('span');
    moreMenu.classList.add('material-symbols-outlined', 'note-more-menu');
    moreMenu.textContent = 'more_horiz';
    header.appendChild(moreMenu);

    noteCard.appendChild(header);

    const body = document.createElement('div');
    body.classList.add('note-body');
    body.textContent = event.content;

    if (imgUrl) {
      const bodyImg = document.createElement('img');
      bodyImg.classList.add('note-body-img');
      bodyImg.src = imgUrl;
      body.appendChild(bodyImg);
    }

    noteCard.appendChild(body);

    const hr = document.createElement('hr');
    noteCard.appendChild(hr);

    const footer = document.createElement('div');
    footer.classList.add('note-card-footer');

    const comments = document.createElement('div');
    comments.classList.add('note-comments', 'footer-icon');
    const commentsIcon = document.createElement('span');
    commentsIcon.classList.add('material-symbols-outlined');
    commentsIcon.textContent = 'chat_bubble';
    comments.appendChild(commentsIcon);
    footer.appendChild(comments);

    const likes = document.createElement('div');
    likes.classList.add('note-likes', 'footer-icon');
    const likesIcon = document.createElement('span');
    likesIcon.classList.add('material-symbols-outlined');
    likesIcon.textContent = 'favorite';
    likes.appendChild(likesIcon);
    footer.appendChild(likes);

    const share = document.createElement('div');
    share.classList.add('note-share', 'footer-icon');
    const shareIcon = document.createElement('span');

    shareIcon.classList.add('material-symbols-outlined');
    shareIcon.textContent = 'share';
    share.appendChild(shareIcon);
    footer.appendChild(share);

    const bolt = document.createElement('div');
    bolt.classList.add('note-bolt', 'footer-icon');
    const boltIcon = document.createElement('span');
    boltIcon.classList.add('material-symbols-outlined');
    boltIcon.textContent = 'bolt';
    bolt.appendChild(boltIcon);
    footer.appendChild(bolt);

    noteCard.appendChild(footer);

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

export function checkForImgUrlInString(string) {
  const regex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;
  const found = string.match(regex);
  if (found) {
    return found[0];
  }
}

export function showImgInNoteCard(string) {
  const imgurl = checkForImgUrlInString(string);
  if (imgurl) {
    const img = document.createElement('img');
    img.src = imgurl;
    img.classList.add('note-img');
    return img;
  }
}

// User profile page
export function getUserProfilePage() {
  const storedData = localStorage.getItem(pubkey);

  const { name, website, nip05, picture } = JSON.parse(storedData);
}
