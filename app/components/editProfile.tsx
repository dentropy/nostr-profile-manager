import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAtom } from "jotai";
import { alignProperty } from "node_modules/@mui/material/esm/styles/cssUtils";
import React from "react";
import { editProfileEventId, accountsAtom, profileEvents, wsPublish } from "~/jotaiAtoms";

import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent, nip19 } from 'nostr-tools'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
import { JsonEditor } from 'json-edit-react'

const style = {
    color: "black",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};
import { createRxNostr } from "rx-nostr";
import { seckeySigner } from "@rx-nostr/crypto";

import { ToggleRelayList } from "./selectRelays";
import { relayListAtom, selectedRelayListAtom, relayWebSocketsAtom } from "~/jotaiAtoms";
export default function EditNostrProfile() {
    const [editEventId, setEventId] = useAtom(editProfileEventId)
    const [profiles, setProfiles] = useAtom(profileEvents)
    const [accounts, setAccounts] = useAtom(accountsAtom)
    const [selectedRelays, setSelectedRelays] = useAtom(selectedRelayListAtom);
    const [relayWebSockets, setRelayWebSockets] = useAtom(relayWebSocketsAtom);

    let project_content = Object.assign({}, profiles[editEventId].json_content);
    let minimumProfileKeys = [
        'name',
        'display_name',
        'nip05',
        'about',
        'picture',
        'banner',
        'website'
    ]
    minimumProfileKeys.forEach(str => {
        if (!(str in project_content)) {
            project_content[str] = ""; // or any default value
        }
    });
    const [profileJsonData, setProfileJsonData] = React.useState(project_content);

    async function publishEvents() {
        let content = JSON.stringify(profileJsonData)
        let sk0: any = nip19.decode(accounts[0].nsec).data
        let new_event = await finalizeEvent({
            kind: 0,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: content,
        }, sk0)
        for (const relay of selectedRelays) {
            console.log(relay)
            relayWebSockets[relay].send(
                JSON.stringify([
                "EVENT",
                new_event,
                ])
            )
            let tmpSocket = new WebSocket(relay)
            tmpSocket.send(JSON.stringify([
                "EVENT",
                new_event,
            ]))
        }
    }
    return (
        <>
            <Typography
                variant="body1"
                style={{ textAlign: "left", display: "flex" }}
            >
                Edit your Profile JSON
            </Typography>
            <Box
                component="form"
                sx={{ "& > :not(style)": { m: 1, width: "100ch" } }}
                noValidate={true}
                autoComplete="off"
            >
                <JsonEditor
                    data={profileJsonData}
                    setData={setProfileJsonData}
                />
            </Box>
            <Typography
                variant="body1"
                style={{ textAlign: "left", display: "flex" }}
            >
                Select your Relays
            </Typography>
            <ToggleRelayList></ToggleRelayList>
            <Button variant="contained" onClick={publishEvents}>Publish Updated Profile</Button>
        </>
    );
}
