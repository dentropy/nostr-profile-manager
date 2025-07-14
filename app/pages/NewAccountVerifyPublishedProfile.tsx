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
    selectedAccountAtom
} from "~/jotaiAtoms";

import { my_pool } from "~/relays";

import { Box, Button, Typography } from "@mui/material";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { NPool, NRelay1 } from "@nostrify/nostrify";

import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';

import wordwrap from 'wordwrapjs'

import { CodeBlock } from "~/components/CodeBlock";
export default function NewAccountVerifyPublishedProfile() {
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const [editEventId, setEventId] = useAtom(editProfileEventId);
    const [profiles, setProfiles] = useAtom(profileEvents);
    const [accounts, setAccounts] = useAtom(accountsAtom);
    const [selectedRelays, setSelectedRelays] = useAtom(selectedRelayListAtom);
    const [profileJson, setProfileJson] = useAtom(EditProfileJson);
    const [theRelayList, setTheRelayList] = useAtom(masterRelayList);
    const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);

    const [events, setEvents] = React.useState({});
    // hljs.registerLanguage('javascript', javascript);
    // const highlightedCode = hljs.highlight(JSON.stringify(events, null, 2), { language: 'javascript' }).value



    async function checkRelays() {
        let the_filter = { authors: [accounts[selectedAccount].pubkey], kinds: [0] };

        // console.log("RUNNING_THE_FILTER")
        // console.log(accounts[selectedAccount]);
        // console.log(accounts[selectedAccount].pubkey);
        // console.log("the_filter");
        // console.log(the_filter)
        let theEventsObj = {}
        for (const tmp_relay_url of theRelayList.relays.testing) {
            const myrelay = new NRelay1(tmp_relay_url);
            console.log(`CheckingRelayNewAccount ${tmp_relay_url}`)
            await new Promise(resolve => setTimeout(resolve, 500));
            for await (
                const msg of myrelay.req([the_filter])
            ) {
                if (msg[0] === "EVENT") {
                    console.log("GOT_VERIFICATION_EVENT");
                    console.log(msg[2]);
                    console.log("SETTING_VERIFICATION_EVENT")
                    console.log(events)
                    console.log("theEventsObj")
                    console.log(theEventsObj)
                    console.log("Object.keys(events)")
                    console.log(Object.keys(events))

                    if (!Object.keys(theEventsObj).includes(selectedAccount)) {
                        console.log("TRIED_SETTING")
                        // setEvents((prevItems) => ({
                        //     ...prevItems,
                        //     [selectedAccount]: {
                        //         ...prevItems[selectedAccount],
                        //         [msg[2].id]: { event: msg[2], relays: [tmp_relay_url] }
                        //     },
                        // }))
                        let profile_json = undefined
                        if (msg[2].kind == 0) {
                            try {
                                profile_json = JSON.parse(msg[2].content)
                            } catch (error) {
                                console.log("Could not parse profile_json")
                                console.log(error)
                            }
                        }
                        if (profile_json != undefined) {
                            theEventsObj = {
                                ...theEventsObj,
                                [selectedAccount]: {
                                    ...theEventsObj[selectedAccount],
                                    [msg[2].kind]: {
                                        [msg[2].id]: {
                                            profile_json: profile_json,
                                            event: msg[2],
                                            relays: [tmp_relay_url]
                                        }
                                    }
                                }
                            }
                        } else {
                            theEventsObj = {
                                ...theEventsObj,
                                [selectedAccount]: {
                                    ...theEventsObj[selectedAccount],
                                    [msg[2].kind]: {
                                        [msg[2].id]: {
                                            event: msg[2],
                                            relays: [tmp_relay_url]
                                        }
                                    }
                                }
                            }
                        }
                        setEvents(theEventsObj)
                    } else {
                        if (!theEventsObj[selectedAccount][msg[2].kind][msg[2].id].relays.includes(tmp_relay_url)) {
                            console.log("TRIED_UPDATING")
                            // setEvents((prevItems) => ({
                            //     ...prevItems,
                            //     [selectedAccount]: {
                            //         ...prevItems[selectedAccount],
                            //         [msg[2].id]: {
                            //             ...prevItems[selectedAccount][msg[2].id],
                            //             relays: [...prevItems[selectedAccount][msg[2].id].relays, tmp_relay_url]
                            //         }
                            //     }
                            // }))
                            theEventsObj = {
                                ...theEventsObj,
                                [selectedAccount]: {
                                    ...theEventsObj[selectedAccount],
                                    [msg[2].kind]: {
                                        ...theEventsObj[selectedAccount][msg[2].kind],
                                        [msg[2].id]: {
                                            ...theEventsObj[selectedAccount][msg[2].kind][msg[2].id],
                                            relays: [...theEventsObj[selectedAccount][msg[2].kind][msg[2].id].relays, tmp_relay_url]
                                        }
                                    }
                                },
                            }
                            setEvents(theEventsObj)
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
        checkRelays();
    }, []);
    return (
        <>
            <h1>Verify Your Nostr Profile Was Published Sucessfully</h1>

            <SyntaxHighlighter language="json" style={docco}>
                {JSON.stringify(theRelayList.relays.testing, null, 2)}
            </SyntaxHighlighter>


            <SyntaxHighlighter language="json" style={docco}>
                {JSON.stringify(accounts, null, 2)}
            </SyntaxHighlighter>

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
