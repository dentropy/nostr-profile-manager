import React, { useEffect, useRef } from 'react';

import { useAtom } from "jotai";
import {
    accountsAtom,
    appPageAtom,
    editProfileEventId,
    EditProfileJson,
    masterRelayList,
    profileEvents,
    selectedAccountAtom,
    selectedRelayGroup
} from "~/jotaiAtoms";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { my_pool } from "~/relays";
import { NRelay1 } from '@nostrify/nostrify';

import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


export const DisplayProfileEvent = ({ event_id }) => {
    const [events, setEvents] = useAtom(profileEvents)
    const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
    const [open, setOpen] = React.useState(false);
    const [relayObj, setRealyObj] = useAtom(masterRelayList);
    const [relayGroup, setRelayGroup] = useAtom(selectedRelayGroup);
    const [possibleRelays, setPossibleRelays] = React.useState([{ label: 'wss://ditto.local' }]);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [selectedRelay, setSelectedRelay] = React.useState(null);
    const [profileJson, setProfileJson] = useAtom(EditProfileJson)
    const [appPage, setAppPage] = useAtom(appPageAtom);
    React.useEffect(() => {
        let relays_with_label = []
        for (const relay_url of relayObj.relay_url_list[relayGroup].urls) {
            relays_with_label.push({ label: relay_url })
        }
        setPossibleRelays(relays_with_label)
    }, [])

    const EditAndPublishEvent = () => {
        setProfileJson(events[selectedAccount][0][event_id].profile_json)
        setAppPage({ page: "New Account Profile" });
    }
    const publishToRelay = async () => {
        try {
            // let tmp_relay = new NRelay1(selectedRelay.label)
            // tmp_relay.event(events[selectedAccount][0][event_id].event)
            let tmp_pool = my_pool.group([selectedRelay.label])
            tmp_pool.event(events[selectedAccount][0][event_id].event)
        } catch (error) {
            console.log(error)
            console.log("GOT_ERROR_PUBLISHING_EVENT")
        }
    };
    return (
        <>
            <Box
                sx={{
                    width: '90vw', // Uses viewport width to maintain 20% regardless of dev console
                    backgroundColor: '#f0f0f0',
                    padding: '16px',
                    boxSizing: 'border-box'
                }}
            >

                <Typography
                    variant="h3"
                    style={{ textAlign: "left", display: "flex" }}
                >
                    Profile Information <br></br>
                </Typography>
                <Typography
                    variant="h6"
                    style={{ textAlign: "left", display: "flex" }}
                >
                    Published On {new Date(events[selectedAccount][0][event_id].event.created_at * 1000).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })}
                </Typography>
                <SyntaxHighlighter language="json" style={docco} wrapLongLines={true}>
                    {JSON.stringify(events[selectedAccount][0][event_id].profile_json, null, 2)}
                </SyntaxHighlighter>
                <Typography
                    variant="h3"
                    style={{ textAlign: "left", display: "flex" }}
                >
                    Relay's this Event is On
                </Typography>
                <SyntaxHighlighter language="json" style={docco} wrapLongLines={true}>
                    {JSON.stringify(events[selectedAccount][0][event_id].relays, null, 2)}
                </SyntaxHighlighter>
                <Typography
                    variant="h3"
                    style={{ textAlign: "left", display: "flex" }}
                >
                    Raw Event
                </Typography>
                <SyntaxHighlighter language="json" style={docco} wrapLongLines={true}>
                    {JSON.stringify(events[selectedAccount][0][event_id].event, null, 2)}
                </SyntaxHighlighter>
                <Button
                    variant="contained"
                    onClick={handleOpen}
                >
                    Rebroadcast This Event
                </Button>
                <br></br>
                <Button
                    variant="contained"
                    onClick={() => EditAndPublishEvent()}
                >
                    Edit and Publish this Profile
                </Button>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    color: "black",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                }}>
                    <p>PAUL _WAS_HERE</p>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Text in a modal
                    </Typography>
                    <Typography
                        id="modal-modal-description"
                        sx={{ mt: 2 }}
                    >
                        Select a Relay You Would Like To Publish To {JSON.stringify(selectedRelay)}
                    </Typography>
                    <Autocomplete
                        freeSolo
                        disablePortal
                        options={possibleRelays}
                        sx={{ width: 300 }}
                        onInputChange={(event, newInputValue) => {
                            setSelectedRelay({ label: newInputValue }); // Update input value as the user types
                        }}
                        onChange={(event, newValue) => {
                            console.log(event)
                            console.log(newValue)
                            setSelectedRelay(newValue)
                        }
                        }
                        renderInput={(params) => <TextField {...params} label="Select Relays" />}
                    />
                    <Button
                        variant="contained"
                        onClick={publishToRelay}
                    >
                        Publish To This Relay
                    </Button>
                </Box>
            </Modal >
        </>
    );
};
