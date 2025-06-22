import { atom } from "jotai";

export const accountsAtom = atom([]);

export const appPageAtom = atom({ page: "Add Account" });

export const profileEvents = atom({});
export const editProfileEventId = atom(undefined);

import { DEFAULT_USERMETA_RELAYS } from "./relays";
export const relayListAtom = atom(DEFAULT_USERMETA_RELAYS)
export const selectedRelayListAtom = atom(DEFAULT_USERMETA_RELAYS)

// let relays_list:any = {}
// for (const relay of DEFAULT_USERMETA_RELAYS){
//     relays_list[relay] = new WebSocket(relay)
// }
export const relayWebSocketsAtom = atom({})
