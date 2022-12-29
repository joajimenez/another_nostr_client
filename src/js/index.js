import {
  relayInit,
  generatePrivateKey,
  getPublicKey,
  getEventHash,
  signEvent,
  // relayPool,
} from 'nostr-tools';

import { formatTimeElapsed } from './utils';
import { extractAndStoreData } from './utils';

// let's connect to a relay
async function connectToRelay() {
  const relay = relayInit('wss://nostr-pub.wellorder.net');
  await relay.connect();

  relay.on('connect', () => {
    console.log(`connected to ${relay.url}`);
  });
  relay.on('error', () => {
    console.log(`failed to connect to ${relay.url}`);
  });

  return relay;
}

// let's query for 100 events
async function getEvents(relay) {
  return new Promise((resolve) => {
    // subscribe to events
    const sub = relay.sub([{ kinds: [0, 1], limit: 100 }]);

    sub.on('event', (event) => {
      if (event.kind === 0) {
        console.log('Set event kind 0 to local storage:', event);
        extractAndStoreData(event);
      } else if (event.kind === 1) {
        // console.log('we got the events kind 1 we wanted:', event);
        createNoteCard(event);
      }
      // resolve(event);
    });
    sub.on('eose', () => {
      sub.unsub();
      resolve(events);
    });
  });
}

// // lets publish an event
// async function publishEvent(relay) {
//   // generate a private key and get the public key
//   const sk = generatePrivateKey();
//   const pk = getPublicKey(sk);

//   // create an event
//   const event = {
//     kind: 1,
//     pubkey: pk,
//     created_at: Math.floor(Date.now() / 1000),
//     tags: [],
//     content: 'testing from barahona',
//   };
//   event.id = getEventHash(event);
//   event.sig = signEvent(event, sk);

//   // publish the event
//   const pub = relay.publish(event);
//   pub.on('ok', () => {
//     console.log(`{relay.url} has accepted our event`);
//   });
//   pub.on('seen', () => {
//     console.log(`we saw the event on {relay.url}`);
//   });
//   pub.on('failed', (reason) => {
//     console.log(`failed to publish to {relay.url}: ${reason}`);
//   });

//   // await relay.close();
// }

// let create the note cards
async function createNoteCard(event) {
  const noteCard = document.createElement('div');
  noteCard.classList.add('note-card');
  noteCard.innerHTML = `
      <div class="note-card-header">
          <div class="note-profile-picture">
          <img
              src="https://i.pravatar.cc/150"
              alt="profile picture"
              class="profile-pic"
          />
          </div>
          <p class="note-profile-username username-el note-title"> ${event.pubkey.substr(
            0,
            7
          )}</p>

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

  //console.log('note card created');
}

async function main() {
  const relay = await connectToRelay();
  const event = await getEvents(relay);
  await createNoteCard(event);
  // await publishEvent(relay);
}

main();
