import { useAtom } from "jotai";
import { appPageAtom } from "~/jotaiAtoms";
import {
    accountsAtom,
    editProfileEventId,
    EditProfileJson,
    profileEvents,
    masterRelayList,
    selectedAccountAtom
} from "~/jotaiAtoms";

import { NSecSigner, NRelay1 } from '@nostrify/nostrify';
import EditNostrProfile from "~/components/EditNostrProfile";
import { Button } from "@mui/material";
import { RelayPage } from "./RelayPage";

import { my_pool } from "~/relays";
// import { createRxNostr } from "rx-nostr";
// import { seckeySigner } from "@rx-nostr/crypto";

export default function NewAccountPublishProfile() {
    const [accounts, setAccounts] = useAtom(accountsAtom);
    const [profileJson, setProfileJson] = useAtom(EditProfileJson);
    const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
    const [relayObj, setRealyObj] = useAtom(masterRelayList);
    // Publish the Profile Event to the Relays
    // Publish the NIP-65 Event to the Relays
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const prevousPage = () => {
        setAppPage({ page: "New Account Relays" });
    };
    const nextPage = () => {
        setAppPage({ page: "New Account Verify Published Profile" });
    };
    const Publish = async () => {
        let nip65_tags = [];
        for (const relay of relayObj.relay_url_list["default"].urls) {
            nip65_tags.push(["r", relay]);
        }
        let unix_time = Math.floor((new Date()).getTime() / 1000);
        console.log("LOOKING_AT_ACCOUNTS")
        console.log(accounts)
        console.log(selectedAccount)
        console.log(accounts[selectedAccount])
        const signer = new NSecSigner(accounts[selectedAccount].privkey);
        const profileEvent = await signer.signEvent({ 
            kind: 0, 
            content: JSON.stringify(profileJson),
            tags: [],
            created_at: unix_time 
        })
        let nip65Event = await signer.signEvent({ 
            kind: 10002,
            content: "",
            tags: nip65_tags,
            created_at: unix_time
        });
        console.log(profileEvent);
        console.log(nip65Event);
        my_pool.event(profileEvent, {relays: selectedRelays})
        my_pool.event(nip65Event, {relays: selectedRelays})
        console.log("SHOULD_HAVE_PUBLISHED_PROFILE")
    };
    return (
        <>
            <h1>Publishing Your Profile</h1>
            <Button variant="contained" onClick={Publish}>
                Publish Everything
            </Button>
            <Button variant="contained" onClick={prevousPage}>
                Previouis: New Account Relays
            </Button>
            <Button variant="contained" onClick={nextPage}>
                Next: Verify Published Profile
            </Button>
            <p>{JSON.stringify(profileJson)}</p>
        </>
    );
}
