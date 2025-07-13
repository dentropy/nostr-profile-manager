export const DEFAULT_USERMETA_RELAYS = [
  "wss://127.0.0.1:6969",
  "wss://purplepag.es",
  "wss://user.kindpag.es",
  "wss://relay.nostr.band",
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.primal.net",
  "wss://t.mememap.net",
  // "wss://relay.mememaps.net",
];

export const DEFAULT_TESTING_RELAYS = [
  "ws://ditto.local/relay",
  "ws://piprelay.local"
  // "wss://purplepag.es",
  // "wss://user.kindpag.es",
  // "wss://relay.nostr.band",
  // "wss://relay.damus.io",
  // "wss://nos.lol",
  // "wss://relay.primal.net",
  // "wss://t.mememap.net"
  // "wss://relay.mememaps.net",
];

import { NPool, NRelay1 } from "@nostrify/nostrify";
// let relay_url = "wss://purplepag.es/";
// export const myrelay = new NRelay1(DEFAULT_USERMETA_RELAYS[0]);

// Get Each User's Relays
export const my_pool = new NPool({
  open: (url) => new NRelay1(url),
  reqRouter: async (filters) => new Map([]),
  eventRouter: async (
    event,
  ) => [],
});
my_pool.group(DEFAULT_USERMETA_RELAYS);
