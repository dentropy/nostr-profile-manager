import { useAtom } from "jotai";
import { nip05Atom } from "~/jotaiAtoms";

import EditNostrProfile from "~/components/EditNostrProfile";
import { Button } from "@mui/material";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alignProperty } from "node_modules/@mui/material/esm/styles/cssUtils";
import React from "react";

import LinkIcon from '@mui/icons-material/Link';

import { ToggleRelayList } from "../components/ToggleRelayList";
import {
    finalizeEvent,
    generateSecretKey,
    getPublicKey,
    nip19,
    verifyEvent,
} from "nostr-tools";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { JsonEditor } from "json-edit-react";
import { rxNostr } from "~/index";
import { seckeySigner, verifier } from "@rx-nostr/crypto";
import {
    accountsAtom,
    appPageAtom,
    editProfileEventId,
    profileEvents,
    selectedAccountAtom,
} from "~/jotaiAtoms";
import { my_pool } from "~/relays";
import { NSecSigner } from "@nostrify/nostrify";

export default function ClaimNIP05() {
    const [username, setUsername] = React.useState("");
    const [validUsername, setValidUsername] = React.useState(false);
    const [foundUsername, setFoundUsername] = React.useState(false);
    const [enableLinkToWellKnown, setEnableLinkToWellKnown] = React.useState(false);

    const [nip05Data, setNIP05Data] = useAtom(nip05Atom);
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const [accounts, setAccounts] = useAtom(accountsAtom);
    const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);

    async function claimNIP05() {
        let signer = undefined;
        if (accounts[selectedAccount].type == "nip-07") {
            signer = window.nostr;
        } else {
            signer = new NSecSigner(accounts[selectedAccount].privkey);
        }
        const unix_time: number = Math.floor((new Date()).getTime() / 1000);
        let mah_event = await signer.signEvent({
            kind: 3036,
            content: "Hello, world!",
            tags: [
                ["L", "nip05.domain"],
                ["l", nip05Data.tld.toLowerCase(), "nip05.domain"],
                ["p", accounts[selectedAccount].pubkey],
                ["d", username.toLowerCase()],
            ],
            created_at: unix_time,
        });
        await my_pool.event(mah_event, { relays: nip05Data.relay_urls })
        setEnableLinkToWellKnown(true)
    }
    function checkValidUsername(username) {
        if (!/^[a-z0-9_.-]*$/.test(username)) {
            setValidUsername(false);
        } else {
            setValidUsername(true);
        }
    }
    async function checkNIP05Exists() {
        const the_filter = {
            kinds: [30360],
            authors: [nip19.decode(nip05Data.bot_npub).data],
            "#d": [username],
        };
        console.log("THE_FILTER", the_filter);
        let found_username = true;
        for await (
            const msg of my_pool.req([the_filter], {
                relays: nip05Data.relay_urls,
            })
        ) {
            console.log(msg);
            if (msg[0] === "EVENT") {
                console.log("FOUND_A_EVENT");
                console.log(msg[2]);
                found_username = false;
            }
            if (msg[0] === "EOSE") break;
        }
        console.log(`found_username: ${found_username}`);
        setFoundUsername(found_username);
        console.log("DONE_WITH_THE_FILTER");
    }
    return (
        <>
            <Typography
                variant="body1"
                style={{ textAlign: "left", display: "flex" }}
            >
                Claim Your NIP05
            </Typography>
            <br />
            <TextField
                id="raw-mnemonic-input"
                label="Raw Mnemonic"
                multiline
                rows={1}
                defaultValue={username}
                variant="standard"
                onChange={(e) => {
                    console.log(e.target.value);
                    const newVal = e.target.value.toLocaleLowerCase();
                    checkValidUsername(newVal);
                    setUsername(newVal);
                    setFoundUsername(false);
                }}
            />
            <Typography
                variant="body1"
                style={{ textAlign: "left", display: "flex" }}
            >
                Your NIP05 will be: {username}@{nip05Data.tld} <br></br>
                {JSON.stringify(foundUsername)}
            </Typography>
            <Button
                variant="contained"
                onClick={checkNIP05Exists}
                disabled={!validUsername}
            >
                Check if NIP05 Already Cleaimed
            </Button>
            <Button
                variant="contained"
                onClick={claimNIP05}
                disabled={!foundUsername}
            >
                Claim you NIP05
            </Button>
            {/* Conditional Content Rendering */}
            {enableLinkToWellKnown && (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        href={`${nip05Data.url_schema}://${nip05Data.tld}:${nip05Data.port}/.well-known/nostr.json?name=${username.toLocaleLowerCase()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<LinkIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Visit {nip05Data.tld} and verify your NIP05 is set
                    </Button>
                </>
            )}
        </>
    );
}
