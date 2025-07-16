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

import { my_pool } from "~/relays";

import { Box, Button, Typography } from "@mui/material";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { NPool, NRelay1 } from "@nostrify/nostrify";

import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';

import { EditRelayList } from "~/components/EditRealyList";
import { CodeBlock } from "~/components/CodeBlock";
export default function NewAccountVerifyPublishedProfile() {
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const [editEventId, setEventId] = useAtom(editProfileEventId);
    const [profiles, setProfiles] = useAtom(profileEvents);
    const [accounts, setAccounts] = useAtom(accountsAtom);
    const [profileJson, setProfileJson] = useAtom(EditProfileJson);
    const [relayObj, setRealyObj] = useAtom(masterRelayList);
    const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
    const [events, setEvents] = React.useState({});
    async function checkRelays() {
        let the_filter = { authors: [accounts[selectedAccount].pubkey], kinds: [0] };
        console.log("THE_FILTER")
        console.log(the_filter)
        for (const tmp_relay_url of relayObj.relay_url_list["testing"].urls) {
            console.log(`relayObj.relay_url_list["testing"].urls`)
            console.log(relayObj.relay_url_list["testing"].urls)
            console.log(tmp_relay_url)
            const myrelay = new NRelay1(tmp_relay_url);
            console.log(`CheckingRelayNewAccount ${tmp_relay_url}`)
            await new Promise(resolve => setTimeout(resolve, 500));
            let we_set_it_continue_plz = true
            for await (
                const msg of myrelay.req([the_filter])
            ) {
                if (msg[0] === "EVENT") {
                    if (msg[2].kind == 0) {
                        let profile_json = undefined
                        if (msg[2].kind == 0) {
                            try {
                                profile_json = JSON.parse(msg[2].content)
                            } catch (error) {
                                console.log("Could not parse profile_json")
                                console.log(msg[2])
                                console.log(error)
                            }
                        }
                        // Check if account is added to events or not, if it is add everything
                        console.log("PAUL_WAS_ALSO_HERE")
                        console.log(selectedAccount)
                        console.log(Object.keys(events))
                        if (Object.keys(events).length == 0 ) {
                            let obj = {
                                [selectedAccount]: {
                                    [`${msg[2].kind}`]: {
                                        [msg[2].id]: {
                                            profile_json: profile_json,
                                            event: msg[2],
                                            relays: [tmp_relay_url]
                                        }
                                    }
                                }
                            }
                            console.log("THE_OBJ")
                            console.log(obj)
                            setEvents(obj)
                            await new Promise(resolve => setTimeout(resolve, 500));
                            we_set_it_continue_plz = true
                        }
                        console.log("LOOKING_INSIDE_AGAIN")
                        console.log(Object.keys(events))
                        if (!Object.keys(events).includes(selectedAccount)) {
                            console.log("WHY_IS_THIS_SETTING")
                            console.log(selectedAccount)
                            console.log(Object.keys(events))
                            setEvents((prevItems) => ({
                                ...prevItems,
                                [selectedAccount]: {
                                    ...prevItems[selectedAccount],
                                    [`${msg[2].kind}`]: {
                                        [msg[2].id]: {
                                            profile_json: profile_json,
                                            event: msg[2],
                                            relays: [tmp_relay_url]
                                        }
                                    }
                                }
                            }))
                            await new Promise(resolve => setTimeout(resolve, 500));
                            console.log("SET_INITAL_EVENTS")
                            console.log(events)
                        } else {
                            // Check if the event_id exists or not
                            if (!Object.keys(events[selectedAccount][`${msg[2].kind}`]).includes(`${msg[2].kind}`)) {
                                // Check if relay is already in the list
                                console.log("WAS_SET")
                                if (!events[selectedAccount][`${msg[2].kind}`][msg[2].id].relays.includes(tmp_relay_url)) {
                                    setEvents((prevItems) => ({
                                        ...prevItems,
                                        [selectedAccount]: {
                                            ...prevItems[selectedAccount],
                                            [`${msg[2].kind}`]: {
                                                ...prevItems[selectedAccount][`${msg[2].kind}`],
                                                [msg[2].id]: {
                                                    ...prevItems[selectedAccount][`${msg[2].kind}`][msg[2].id],
                                                    relays: [...prevItems[selectedAccount][`${msg[2].kind}`][msg[2].id].relays, tmp_relay_url]
                                                }
                                            }
                                        },
                                    }));
                                    await new Promise(resolve => setTimeout(resolve, 500));
                                    console.log("SET_OTHER_EVENTS")
                                    console.log(events)
                                }
                            } else {
                                console.log("NOT_SET")
                                setEvents((prevItems) => ({
                                    ...prevItems,
                                    [selectedAccount]: {
                                        ...prevItems[selectedAccount],
                                        [`${msg[2].kind}`]: {
                                            ...prevItems[selectedAccount][`${msg[2].kind}`],
                                            [msg[2].id]: {
                                                profile_json: profile_json,
                                                event: msg[2],
                                                relays: [...prevItems[selectedAccount][`${msg[2].kind}`][msg[2].id].relays, tmp_relay_url]
                                            }
                                        }
                                    },
                                }));
                                await new Promise(resolve => setTimeout(resolve, 500));
                                console.log("NOT_SET_EVENTS")
                                console.log(events)
                            }
                        }
                    }
                }
                if (msg[0] === "EOSE") break; // Sends a `CLOSE` message to the relay.
            }
            myrelay.close()
        }
    }

    const prevousPage = () => {
        setAppPage({ page: "New Account Profile" });
    };
    const nextPage = () => {
        setAppPage({ page: "New Account Publish Profile" });
    };

    React.useEffect(() => {
        console.log("PAUL_WAS_HERE_123123123123123123")
        checkRelays();
    }, []);
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
                    {JSON.stringify(accounts, null, 2)}
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
