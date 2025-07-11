import { useAtom } from "jotai";
import { appPageAtom } from "~/jotaiAtoms";
import {
    accountsAtom,
    editProfileEventId,
    EditProfileJson,
    profileEvents,
    selectedRelayListAtom,
} from "~/jotaiAtoms";

import EditNostrProfile from "~/components/EditNostrProfile";
import { Button } from "@mui/material";
import { RelayPage } from "./RelayPage";

import { createRxNostr } from "rx-nostr";
import { seckeySigner } from "@rx-nostr/crypto";

export default function NewAccountPublishProfile() {
    // Fetch THe Profile
    // Fetch the Relays we want to Publish to
    const [editEventId, setEventId] = useAtom(editProfileEventId);
    const [profiles, setProfiles] = useAtom(profileEvents);
    const [accounts, setAccounts] = useAtom(accountsAtom);
    const [selectedRelays, setSelectedRelays] = useAtom(selectedRelayListAtom);
    const [profileJson, setProfileJson] = useAtom(EditProfileJson);

    console.log("Checking Accounts");
    console.log(accounts);
    console.log(profileJson);
    const rxNostr = createRxNostr({
        signer: seckeySigner(accounts[0].nsec),
    });
    rxNostr.setDefaultRelays(selectedRelays);

    // Publish the Profile Event to the Relays
    // Publish the NIP-65 Event to the Relays
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const prevousPage = () => {
        setAppPage({ page: "New Account Relays" });
    };
    const Publish = () => {
        console.log("Should Publish");
        console.log(rxNostr)
        let nip65_tags = []
        for(const relay of selectedRelays) {
            nip65_tags.push(["r", relay])
        }
        let profileEvent = rxNostr.send({
            kind: 0,
            content: JSON.stringify(profileJson),
        });
        let nip65Event = rxNostr.send({
            kind: 10002,
            content: "",
            tags: nip65_tags
        });
        console.log(profileEvent)
        console.log(nip65Event)


    };
    const nextPage = () => {
        setAppPage({ page: "New Account Verify Published Profile" });
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
