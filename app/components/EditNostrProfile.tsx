import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alignProperty } from "node_modules/@mui/material/esm/styles/cssUtils";
import React from "react";

import { EditRelayList } from "./EditRealyList";
import {
    finalizeEvent,
    generateSecretKey,
    getPublicKey,
    nip19,
    verifyEvent,
} from "nostr-tools";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { JsonEditor } from "json-edit-react";

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


import { rxNostr } from "~/index";
export default function EditNostrProfile() {
    const [editEventId, setEventId] = useAtom(editProfileEventId);
    const [profiles, setProfiles] = useAtom(profileEvents);
    let project_content = Object.assign({}, profiles[editEventId].json_content);
    let minimumProfileKeys = [
        "name",
        "display_name",
        "nip05",
        "about",
        "picture",
        "banner",
        "website",
    ];
    minimumProfileKeys.forEach((str) => {
        if (!(str in project_content)) {
            project_content[str] = ""; // or any default value
        }
    });
    const [profileJsonData, setProfileJsonData] = useAtom(EditProfileJson);


    const [accounts, setAccounts] = useAtom(accountsAtom)
    const [relayObj, setRealyObj] = useAtom(masterRelayList)
    const [relayGroup, setRelayGroup] = useAtom(selectedRelayGroup);
    const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
    const publishProfile = async () => {
        console.log("WE_SHOULD_PUBLISH")
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
            <Typography
                variant="h3"
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
                variant="h3"
                style={{ textAlign: "left", display: "flex" }}
            >
                Select The Relays You Want To Publish To
            </Typography>
            <Box>
                <EditRelayList></EditRelayList>
            </Box>
            <Button variant="contained" onClick={publishProfile}>
                Publish Your Profile
            </Button>
            {
                /* <Typography
                variant="body1"
                style={{ textAlign: "left", display: "flex" }}
            >
                Select your Relays
            </Typography>
            <ToggleRelayList></ToggleRelayList>
            <Button variant="contained" onClick={publishEvents}>Publish Updated Profile</Button> */
            }
        </>
    );
}
