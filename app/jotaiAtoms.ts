import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

// Desult State Systems
export const appPageAtom = atom({ page: "Add Account" });

const storage = createJSONStorage(() => sessionStorage);

// export const accountsAtom = atom([]);
export const accountsAtom = atomWithStorage("accountsAtom", {
    "template_account": {
                    mnemonic: "template_account",
                    nsec: "template_account",
                    npub: "template_account",
                    privkey: "template_account",
                    pubkey: "template_account",
                }
}, storage);

// export const selectedAccount = atom({});
export const selectedAccountAtom = atomWithStorage(
    "selectedAccount",
    "template_account",
    storage,
);

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
    "relay_url_list": {
        "default": {
            urls: DEFAULT_USERMETA_RELAYS,
        },
        "testing": {
            urls: DEFAULT_TESTING_RELAYS,
        },
    },
}, storage);
export const selectedRelayGroup = atomWithStorage("masterRelayList", "default")

export const ProfileJsonData = atom({
    events: {},
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
