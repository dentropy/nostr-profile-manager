import * as React from "react";

import { useAtom } from "jotai";
import {
    accountsAtom,
    appPageAtom,
    editProfileEventId,
    EditProfileJson,
    masterRelayList,
    profileEvents,
    selectedRelayListAtom,
} from "~/jotaiAtoms";

import { my_pool } from "~/relays";

import { Button } from "@mui/material";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function NewAccountVerifyPublishedProfile() {
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const [editEventId, setEventId] = useAtom(editProfileEventId);
    const [profiles, setProfiles] = useAtom(profileEvents);
    const [accounts, setAccounts] = useAtom(accountsAtom);
    const [selectedRelays, setSelectedRelays] = useAtom(selectedRelayListAtom);
    const [profileJson, setProfileJson] = useAtom(EditProfileJson);
    const [theRelayList, setTheRelayList] = useAtom(masterRelayList);

    const [events, setEvents] = React.useState({});

    async function run_filter() {
        console.log("RUNNING_THE_FILTER")
        console.log(accounts["testing"]);
        console.log(accounts["testing"].pubkey);
        let the_filter = { authors: [accounts["testing"].pubkey], kinds: [0] };
        console.log("the_filter");
        console.log(the_filter);
        for await (
            const msg of my_pool.req([the_filter], {
                relays: theRelayList.relays.testing,
            })
        ) {
            if (msg[0] === "EVENT") {
                console.log("GOT_VERIFICATION_EVENT");
                console.log(msg[2]);
                // Add new item to the dictionary without overwriting
                setEvents((prevItems) => ({
                    ...prevItems, // Spread existing items
                    [msg[2].id]: msg[2], // Add new item with unique key
                }))
            }
            if (msg[0] === "EOSE") break; // Sends a `CLOSE` message to the relay.
        }
        console.log("DONE_RUNNING_FILRER")
    }

    const checkRelays = () => {
        run_filter();
    };

    const prevousPage = () => {
        setAppPage({ page: "New Account Profile" });
    };
    const nextPage = () => {
        setAppPage({ page: "New Account Publish Profile" });
    };

    React.useEffect(() => {
        run_filter();
    }, []);
    return (
        <>
            <h1>Verify Your Nostr Profile Was Published Sucessfully</h1>

            <SyntaxHighlighter language="json" style={docco}>
                {JSON.stringify(theRelayList.relays.testing, null, 2)}
            </SyntaxHighlighter>

            <SyntaxHighlighter language="json" style={docco}>
                {JSON.stringify(events, null, 2)}
            </SyntaxHighlighter>

            <Button variant="contained" onClick={checkRelays}>
                Check Relays
            </Button>

            <Button variant="contained" onClick={prevousPage}>
                Previouis: New Account Profile
            </Button>
            <Button variant="contained" onClick={nextPage}>
                Next: New Account Publish Profile
            </Button>
        </>
    );
}
