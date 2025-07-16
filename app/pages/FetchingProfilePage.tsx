import * as React from "react";

import { useAtom } from "jotai";
import { appPageAtom, accountsAtom,selectedAccountAtom, masterRelayList, EditProfileJson } from "~/jotaiAtoms";

import EditNostrProfile from "~/components/EditNostrProfile";
import NostrProfile from "~/components/NostrProfile";
import { Box, Button, Typography } from "@mui/material";

import { EditRelayList } from "~/components/EditRealyList";
import { NRelay1 } from "@nostrify/nostrify";
export default function FetchingProfilePage() {
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const [accounts, setAccounts] = useAtom(accountsAtom);
    const [events, setEvents] = React.useState({});
    const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
    const [relayObj, setRealyObj] = useAtom(masterRelayList)
    const [profileJson, setProfileJson] = useAtom(EditProfileJson)
    const prevousPage = () => {
        setAppPage({ page: "New Account Keys" });
    };
    const nextPage = () => {
        setAppPage({ page: "New Account Verify Published Profile" });
    };
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
    React.useEffect(() => {
        console.log("PAUL_WAS_HERE_123123123123123123")
        checkRelays();
    }, []);
    return (
        <>
            <h1>Let's look around for your profile</h1>
            <Typography
                variant="h3"
                style={{ textAlign: "left", display: "flex" }}
            >
                Relays We Are Searching
            </Typography>
            <Box>
                <EditRelayList></EditRelayList>
            </Box>

            {/* <SyntaxHighlighter language="json" style={docco}>
                {JSON.stringify(accounts, null, 2)}
            </SyntaxHighlighter> */}
            <Box sx={{
                maxWidth: "100%", // Ensure container doesn't exceed parent width
                overflowX: "auto", // Enable horizontal scrolling for overflow
                padding: "10px",
                boxSizing: "border-box", // Prevent padding from causing overflow
            }}>
                <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {JSON.stringify(selectedAccountAtom)}
                    {JSON.stringify(accounts[selectedAccountAtom], null, 2)}
                </pre>
            </Box>

            <Box sx={{
                maxWidth: "100%", // Ensure container doesn't exceed parent width
                overflowX: "auto", // Enable horizontal scrolling for overflow
                padding: "10px",
                boxSizing: "border-box", // Prevent padding from causing overflow
            }}>
                <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {JSON.stringify(events, null, 2)}
                </pre>
            </Box>
            <Button variant="contained" onClick={prevousPage}>
                Previous: New Account Keys
            </Button>
            <Button variant="contained" onClick={nextPage}>
                Next: Verify Published Profile
            </Button>
        </>
    );
}
