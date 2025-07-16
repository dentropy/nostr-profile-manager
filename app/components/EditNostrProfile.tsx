import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alignProperty } from "node_modules/@mui/material/esm/styles/cssUtils";
import React from "react";

import { useAtom } from "jotai";
import { accountsAtom, editProfileEventId, profileEvents } from "~/jotaiAtoms";

import {
    finalizeEvent,
    generateSecretKey,
    getPublicKey,
    nip19,
    verifyEvent,
} from "nostr-tools";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { JsonEditor } from "json-edit-react";
import {
    EditProfileJson,
} from "~/jotaiAtoms";

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
