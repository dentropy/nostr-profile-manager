import * as React from "react";

import { useAtom } from "jotai";
import {
    accountsAtom,
    appPageAtom,
    editProfileEventId,
    EditProfileJson,
    masterRelayList,
    profileEvents,
    selectedAccountAtom
} from "~/jotaiAtoms";

import { Box, Button, Typography } from "@mui/material";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { NPool, NRelay1 } from "@nostrify/nostrify";

import { DisplayProfileEvent } from "~/components/DisplayProfileEvent";
import { EditRelayList } from "~/components/EditRealyList";

import NostrAccountData from "~/components/NostrAccountData";
export default function NewAccountVerifyPublishedProfile() {
    const [appPage, setAppPage] = useAtom(appPageAtom)
    const [editEventId, setEventId] = useAtom(editProfileEventId)
    const [profiles, setProfiles] = useAtom(profileEvents)
    const [accounts, setAccounts] = useAtom(accountsAtom)
    const [profileJson, setProfileJson] = useAtom(EditProfileJson)
    const [relayObj, setRealyObj] = useAtom(masterRelayList)
    const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom)
    const [events, setEvents] = useAtom(profileEvents)// React.useState({});

    const [renderProfileEvent, setRenderProileEvents] = React.useState(false)

    async function checkRelays() {
        const the_filter = { authors: [accounts[selectedAccount].pubkey], kinds: [0] };
        console.log("THE_FILTER", the_filter);

        // Batch updates to events in a local object before setting state
        let updatedEvents = { ...events };

        for (const tmp_relay_url of relayObj.relay_url_list["testing"].urls) {
            console.log("Checking relay:", tmp_relay_url);
            const myrelay = new NRelay1(tmp_relay_url);
            await new Promise(resolve => setTimeout(resolve, 500));

            for await (const msg of myrelay.req([the_filter])) {
                if (msg[0] === "EVENT" && msg[2].kind === 0) {
                    let profile_json;
                    try {
                        profile_json = JSON.parse(msg[2].content);
                    } catch (error) {
                        console.log("Could not parse profile_json", msg[2], error);
                    }

                    // Initialize account if not present
                    if (!updatedEvents[selectedAccount]) {
                        updatedEvents[selectedAccount] = {};
                    }

                    // Initialize kind if not present
                    if (!updatedEvents[selectedAccount][msg[2].kind]) {
                        updatedEvents[selectedAccount][msg[2].kind] = {};
                    }

                    // Update or add event
                    if (!updatedEvents[selectedAccount][msg[2].kind][msg[2].id]) {
                        // New event
                        updatedEvents[selectedAccount][msg[2].kind][msg[2].id] = {
                            profile_json,
                            event: msg[2],
                            relays: [tmp_relay_url],
                        };
                    } else {
                        // Update existing event with new relay if not already included
                        if (!updatedEvents[selectedAccount][msg[2].kind][msg[2].id].relays.includes(tmp_relay_url)) {
                            updatedEvents[selectedAccount][msg[2].kind][msg[2].id].relays.push(tmp_relay_url);
                        }
                    }
                    setEvents(updatedEvents)
                }
                if (msg[0] === "EOSE") break; // Sends a CLOSE message to the relay
            }
            myrelay.close();
        }

        // Update state once after processing all relays
        setEvents(updatedEvents);
        console.log("Updated events:", updatedEvents);
    }

    const prevousPage = () => {
        setAppPage({ page: "New Account Profile" });
    };
    const nextPage = () => {
        setAppPage({ page: "New Account Publish Profile" });
    };

    React.useEffect(() => {
        console.log("CHECKING_ACCOUNTS")
        console.log(accounts)
        checkRelays();
    }, []);

    React.useEffect(() => {
        try {
            if (Object.keys(events[selectedAccount][0]).length > 0) {
                setRenderProileEvents(true)
            }
        } catch (error) {

        }
    }, [events]);

    return (
        <>
            <Typography
                variant="h2"
                style={{ textAlign: "left", display: "flex" }}
            >
                Verify Your Nostr Profile Was Published Sucessfully
            </Typography>
            <Typography
                variant="h3"
                style={{ textAlign: "left", display: "flex" }}
            >
                Relays We Are Searching
            </Typography>

            <Box>
                <EditRelayList></EditRelayList>
            </Box>

            <Button variant="contained" onClick={checkRelays}>
                Check Relays
            </Button>
            <Box>
                <NostrAccountData
                    mnemonic={accounts[selectedAccount].mnemonic}
                    pubkey={accounts[selectedAccount].pubkey}
                    privkey={accounts[selectedAccount].privkey}
                    npub={accounts[selectedAccount].npub}
                    nsec={accounts[selectedAccount].nsec}
                ></NostrAccountData>
            </Box>

            {renderProfileEvent ? (
                <>
                    {Object.keys(events[selectedAccount][0]).map(item => (
                        <DisplayProfileEvent event_id={item}></DisplayProfileEvent>
                    ))}
                </>

            ) : (
                <h1>Looking for Events {selectedAccount} {JSON.stringify(events[selectedAccount])}</h1>
            )}

            <Button variant="contained" onClick={() => { checkRelays }}>
                Check Relays
            </Button>

            <Button variant="contained" onClick={prevousPage}>
                Previouis: New Account Profile
            </Button>
        </>
    );
}
