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

export default function EditProfile(props) {


    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [editEventId, setEventId] = useAtom(editProfileEventId);
    const [profiles, setProfiles] = useAtom(profileEvents);
    const [accounts, setAccounts] = useAtom(accountsAtom);

    console.log("PAUL_WAS_HERE_123")
    console.log(editEventId);
    console.log(profiles[editEventId]);
    console.log(accounts)


    // const rxNostr = createRxNostr({
    //     signer: seckeySigner(accounts[0].nsec),
    // });
    // rxNostr.setDefaultRelays(["wss://remay.mememaps.net"]);


    const [profileName, setProfileName] = React.useState(
        profiles[editEventId].json_content.name
    );
    const onProfileNameChange = (event: any) => {
        setProfileName(event.target.value);
    };
    const [nip05, setNip05] = React.useState(
        profiles[editEventId].json_content.nip05
    );
    const onNip05Update = (event: any) => {
        setNip05(event.target.value);
    };
    const [displayName, setDisplayName] = React.useState(
        profiles[editEventId].json_content.displayName
    );
    const onDisplayNameChange = (event: any) => {
        setDisplayName(event.target.value);
    };
    const [picture, setPicture] = React.useState(
        profiles[editEventId].json_content.about
    );
    const onPictureChange = (event: any) => {
        setPicture(event.target.value);
    };
    const [banner, setBanner] = React.useState(
        profiles[editEventId].json_content.about
    );
    const onBannerChange = (event: any) => {
        setBanner(event.target.value);
    };
    const [about, setAbout] = React.useState(
        profiles[editEventId].json_content.about
    );
    const onAboutChange = (event: any) => {
        setAbout(event.target.value);
    };
    const [website, setWebsite] = React.useState(
        profiles[editEventId].json_content.website
    );
    const onWebsiteChange = (event: any) => {
        setWebsite(event.target.value);
    };

    async function publishNewEvent() {
        let content = JSON.stringify({
            name: profileName,
            displayName: displayName,
            nip05: nip05,
            picture: picture,
            banner: banner,
            about: about,
            website: website
        })
        console.log(content)
        let sk0 = nip19.decode(accounts[0].nsec).data
        let new_event = await finalizeEvent({
            kind: 0,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: content,
        }, sk0)
        wsPublish.send(JSON.stringify([
                "EVENT",
                new_event,
        ]))

        // rxNostr.send({
        //     kind: 0,
        //     content: content,
        // });
    }
    return (
        <Box
            component="form"
            sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
            noValidate={true}
            autoComplete="off"
        >
            <Typography variant="body1">
                Public Key: {profiles[editEventId].pubkey}
            </Typography>
            <br />
            <Typography
                variant="body1"
                style={{ textAlign: "left", display: "flex" }}
            >
                name
            </Typography>
            <TextField
                style={{
                    color: "white",
                    backgroundColor: "white",
                    textAlign: "right",
                    display: "flex",
                }}
                id="outlined-basic"
                // label="name"
                variant="outlined"
                value={profileName}
                onChange={onProfileNameChange}
            />
            <br />
            <Typography
                variant="body1"
                style={{ textAlign: "left", display: "flex" }}
            >
                NIP05
            </Typography>
            <TextField
                style={{
                    color: "white",
                    backgroundColor: "white",
                    textAlign: "right",
                    display: "flex",
                }}
                id="outlined-basic"
                // label="name"
                variant="outlined"
                value={nip05}
                onChange={onNip05Update}
            />
            <br />
            <Typography
                variant="body1"
                style={{ textAlign: "left", display: "flex" }}
            >
                displayName
            </Typography>
            <TextField
                style={{ color: "white", backgroundColor: "white" }}
                id="outlined-basic"
                label="displayName"
                variant="outlined"
                value={displayName}
                onChange={onDisplayNameChange}
            />
            <br />
            <Typography
                variant="body1"
                style={{ textAlign: "left", display: "flex" }}
            >
                picture
            </Typography>
            <TextField
                style={{ color: "white", backgroundColor: "white" }}
                id="outlined-basic"
                // label="picture"
                variant="outlined"
                value={picture}
                onChange={onPictureChange}
            />
            <br />
            <Typography
                variant="body1"
                style={{ textAlign: "left", display: "flex" }}
            >
                banner
            </Typography>
            <TextField
                style={{ color: "white", backgroundColor: "white" }}
                id="outlined-basic"
                // label="banner"
                variant="outlined"
                value={banner}
                onChange={onBannerChange}
            />
            <br />
            <Typography
                variant="body1"
                style={{ textAlign: "left", display: "flex" }}
            >
                about
            </Typography>
            <TextField
                style={{ color: "white", backgroundColor: "white" }}
                id="outlined-basic"
                // label="about"
                variant="outlined"
                value={about}
                onChange={onAboutChange}
            />
            <br />
            <Typography
                variant="body1"
                style={{ textAlign: "left", display: "flex" }}
            >
                website
            </Typography>
            <TextField
                style={{ color: "white", backgroundColor: "white" }}
                id="outlined-basic"
                // label="website"
                variant="outlined"
                value={website}
                onChange={onWebsiteChange}
            />
            <br />
            <h1>TODO: Add Additional Custom Attributes</h1>
            <Button
                onClick={handleOpen}
                variant="contained"
                style={{ textAlign: "center" }}
            >
                Publish New Profile
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        We are going to publish your profile to wss://relay.mememaps.net
                        <br />
                        Click the button below to confirm
                    </Typography>
                    <Button
                        onClick={publishNewEvent}
                        variant="contained"
                        style={{ textAlign: "center" }}
                    >
                        Publish New Profile
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}
