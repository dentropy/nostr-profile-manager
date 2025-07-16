import { useAtom } from "jotai";
import {
    accountsAtom,
    appPageAtom,
    editProfileEventId,
    EditProfileJson,
    masterRelayList,
    profileEvents,
    relayWebSocketsAtom,
    selectedAccountAtom,
    selectedRelayGroup
} from "~/jotaiAtoms";
import { NSecSigner } from "@nostrify/nostrify";
import { my_pool } from "~/relays";

import EditNostrProfile from "~/components/EditNostrProfile";
import { Button } from "@mui/material";


export default function NewAccountProfile() {
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const prevousPage = () => {
        setAppPage({ page: "New Account Keys" });
    };
    const nextPage = () => {
        setAppPage({ page: "New Account Verify Published Profile" });
    }

    const [accounts, setAccounts] = useAtom(accountsAtom)
    const [relayObj, setRealyObj] = useAtom(masterRelayList)
    const [relayGroup, setRelayGroup] = useAtom(selectedRelayGroup);
     const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
    const publishProfile = async () => {
        let nip65_tags = [];
        for (const relay of relayObj.relay_url_list[relayGroup].urls) {
            nip65_tags.push(["r", relay]);
        }
        let unix_time = Math.floor((new Date()).getTime() / 1000);
        const signer = new NSecSigner(accounts[selectedAccount].privkey);
        const profileEvent = await signer.signEvent({
            kind: 0,
            content: JSON.stringify(profileJsonData),
            tags: [],
            created_at: unix_time,
        });
        let nip65Event = await signer.signEvent({
            kind: 10002,
            content: "",
            tags: nip65_tags,
            created_at: unix_time,
        });
        console.log("Here are our events");
        console.log(profileEvent);
        console.log(nip65Event);
        my_pool.event(profileEvent, { relays: relayObj.relay_url_list[relayGroup].urls });
        my_pool.event(nip65Event, { relays: relayObj.relay_url_list[relayGroup].urls });
    }
    return (
        <>
            <EditNostrProfile></EditNostrProfile>
            <Button variant="contained" onClick={prevousPage}>
                Previouis: New Account Keys
            </Button>
            <Button variant="contained" onClick={nextPage}>
                Next: Verify Published Profile
            </Button>
        </>
    );
}
