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

import { formatTimeElapsed } from './utils';

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
        extractNameAndPicture(event);
      } else if (event.kind === 1) {
        console.log('this is a type 1 event', event);
        // createNoteCard(event);
        createNoteCardFromCache(event);
      }
      resolve(event);
    });

    sub.on('eose', () => {
      sub.unsub();
    });
  });
}

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

async function main() {
  const relay = await connectToRelay();
  const event = await getEvents(relay);
  await extractNameAndPicture(event);
  await createNoteCardFromCache(event);

  // await createNoteCard(event);
  // // await publishEvent(relay);
}

main();
