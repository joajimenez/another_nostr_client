import {
  relayInit,
  generatePrivateKey,
  getPublicKey,
  getEventHash,
  signEvent,
} from 'nostr-tools';

const userProfilePic = document.querySelector('.top-navbar');

// import { formatTimeElapsed } from './utils';
import { extractAndStoreData } from './utils';
import { createNoteCard } from './utils';

const relayPool = [
  'wss://nostr.ono.re',
  'wss://brb.io',
  'wss://nostr-pub.semisol.dev',
  'wss://nostr-pub.wellorder.net',
  'wss://nostr-relay.alekberg.net',
  'wss://nostr-relay.wlvs.space',
  'wss://relay.nostr.info',
  'wss://nostr.bitcoiner.social',
];

// let's connect to a relay
async function connectToRelay(relayUrl) {
  const relay = relayInit(relayUrl);
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

    // Keep track of which events have already been processed
    const processedEvents = new Set();

    sub.on('event', (event) => {
      // Only process the event if it hasn't been processed before
      if (!processedEvents.has(event.id)) {
        processedEvents.add(event.id);

        if (event.kind === 0) {
          //    console.log('Set new event kind 0 to local storage:', event);
          extractAndStoreData(event);
        } else if (event.kind === 1) {
          //console.log('we got and display a new event kind 1:', event);
          createNoteCard(event);
        }
      }
    });
    sub.on('eose', () => {
      sub.unsub();
      resolve();
    });
  });
}

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

async function main() {
  const relays = [];
  for (const relayUrl of relayPool) {
    relays.push(await connectToRelay(relayUrl));
  }

  for (const relay of relays) {
    const event = await getEvents(relay);
    await createNoteCard(event);
  }

  hideNavbar();
  // await publishEvent(relay);
}

/* When the user scrolls down, hide the navbar. 
    When the user scrolls up, show the navbar */

function hideNavbar() {
  let prevScrollpos = window.pageYOffset;
  window.onscroll = function () {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      document.querySelector('.top-navbar').style.top = '0';
    } else {
      document.querySelector('.top-navbar').style.top = '-50px';
    }
    prevScrollpos = currentScrollPos;
  };
}

userProfilePic.addEventListener('click', () => {
  function navigateToUserProfile() {
    window.location.href = 'dist/pages/user_profile.html';
  }

  navigateToUserProfile();
});

main();
