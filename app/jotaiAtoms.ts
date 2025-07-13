import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

// Desult State Systems
export const appPageAtom = atom({ page: "Add Account" });

const storage = createJSONStorage(() => sessionStorage);

// export const accountsAtom = atom([]);
export const accountsAtom = atomWithStorage("accountsAtom", {}, storage);

// export const profileEvents = atom({});
export const profileEvents = atomWithStorage("profileEvents", {}, storage);

// export const editProfileEventId = atom()
export const editProfileEventId = atomWithStorage(
    "editProfileEventId",
    {},
    storage,
);

import { DEFAULT_TESTING_RELAYS, DEFAULT_USERMETA_RELAYS } from "./relays";
export const masterRelayList = atomWithStorage("masterRelayList", {
    "relays": {
        "default": DEFAULT_USERMETA_RELAYS,
        "testing": DEFAULT_TESTING_RELAYS,
    },
}, storage);

export const relayListAtom = atom(DEFAULT_USERMETA_RELAYS);
export const selectedRelayListAtom = atom(DEFAULT_USERMETA_RELAYS);

let relays_list: any = {};
for (const relay of DEFAULT_USERMETA_RELAYS) {
    relays_list[relay] = { enabled: true };
}
export const NIP33Data = atom({
    events: {},
    relay_list: relays_list,
    enabled_relays: DEFAULT_USERMETA_RELAYS,
});

export const ProfileJsonData = atom({
    events: {},
    relay_list: relays_list,
    enabled_relays: DEFAULT_USERMETA_RELAYS,
});

export const EditProfileJson = atom({
    "name": "",
    "display_name": "",
    "nip05": "",
    "about": "",
    "picture": "",
    "banner": "",
    "website": "",
});

export const relayWebSocketsAtom = atom({});
