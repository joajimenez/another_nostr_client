import {
  relayInit,
  generatePrivateKey,
  getPublicKey,
  getEventHash,
  signEvent,
  // relayPool,
} from 'nostr-tools';

import { extractNameAndPicture } from './utils';
import { createNoteCardFromCache } from './utils';
import { extractNameAndPic } from './utils';

import { formatTimeElapsed } from './utils';

// const pool = relayPool();
// pool.addRelay('wss://relay.nostr.info', { read: true, write: true });
// pool.addRelay('wss://nostr.openchain.fr', { read: true, write: true });
// // pool.addRelay('wss://relay.damus.io', {read: true, write: true});
// pool.addRelay('wss://nostr-relay.wlvs.space', { read: true, write: true });
// pool.addRelay('wss://relay.nostr.ch', { read: true, write: true });
// pool.addRelay('wss://nostr.sandwich.farm', { read: true, write: true });

// console.log(pool);

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
    const sub = relay.sub([{ kinds: [0, 1], limit: 15 }]);

    // sub.on('event', (event) => {
    //   console.log('we got the event we wanted:', event);
    //   createNoteCard(event);
    //   resolve(event);
    // });
    // sub.on('eose', () => {
    //   sub.unsub();
    // });

    // check for different types of events

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
  });
}

// let's check if event.kind 0 and kind.kind 1 share the same pubkey and if so, add the event.kind 0 content.name as note-title to a note card

function createNoteCard(event) {
  // get the name and picture from the event.kind 0
  extractNameAndPicture(event);

  // create a note card from the event.kind 1
  createNoteCardFromCache(event);
}

// let's add the event.content and event.picture of event.kind 0 to a note card if the ID is the same as the one we are looking for



// {
//   "id": "2ceea66c4ac0145f9baccc96a46e75dfa50025852399f64383ecb86260642547",
//   "pubkey": "9020e3c6ad0cccf36c63fd1c1382bbd4e67af478f6d27297ac1b746d9f6afa11",
//   "created_at": 1672255629,
//   "kind": 0,
//   "tags": [],
//   "content": "{\"name\":\"chris\",\"about\":\"test\"}",
//   "sig": "db47c1cc5462ffb8ee1fb5723694ea7b416aa8ac93172148bb8a59d167f96f15f02f1e9528ba7405d91d43d0e205eb8f701e29d83115bb6909fc1199c58cab29"
// }

// let's add the event.content and event.picture of event.kind 0 to a note card if the ID is the same as the one we are looking for

// // // lets publish an event
// // async function publishEvent(relay) {
// //   // generate a private key and get the public key
// //   const sk = generatePrivateKey();
// //   const pk = getPublicKey(sk);

// //   // create an event
// //   const event = {
// //     kind: 1,
// //     pubkey: pk,
// //     created_at: Math.floor(Date.now() / 1000),
// //     tags: [],
// //     content: 'testing from barahona',
// //   };
// //   event.id = getEventHash(event);
// //   event.sig = signEvent(event, sk);

// //   // publish the event
// //   const pub = relay.publish(event);
// //   pub.on('ok', () => {
// //     console.log(`{relay.url} has accepted our event`);
// //   });
// //   pub.on('seen', () => {
// //     console.log(`we saw the event on {relay.url}`);
// //   });
// //   pub.on('failed', (reason) => {
// //     console.log(`failed to publish to {relay.url}: ${reason}`);
// //   });

// //   // await relay.close();
// // }

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
