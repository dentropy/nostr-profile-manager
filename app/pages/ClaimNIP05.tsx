import * as React from "react";

import { useAtom } from "jotai";
import { appPageAtom, accountsAtom, selectedAccountAtom, profileEvents, editProfileEventId, NIP05BotRelay, NIP05BotNPUB } from "~/jotaiAtoms";

import { NSecSigner, NRelay1 } from '@nostrify/nostrify';

import NostrAccountData from "~/components/NostrAccountData";
import { generateSecretKey, getPublicKey, nip19, nip04 } from "nostr-tools";
import { Button } from "@mui/material";

import {
    generateSeedWords,
    privateKeyFromSeedWords,
    validateWords,
} from "nostr-tools/nip06";
import { bytesToHex } from "nostr-tools/utils";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { my_pool } from "~/relays";
export default function ClaimNIP05() {
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const [nip05Username, setNip05Username] = React.useState("")
    const [nip05UsernameValidity, setNip05UsernameValidity] = React.useState(true)
    const hasRun = React.useRef(false);
    const [nip05Relay] = useAtom(NIP05BotRelay)
    const [nip05npub] = useAtom(NIP05BotNPUB)
    // const tmpRelay = new NRelay1(nip05Relay)
    const checkNIP05Claimed = () => {
        console.log("checkNIP05Claimed")
    }
    const selectNewAccount = () => {
        setAppPage({ page: "New Account Profile" });
    }
    const [profiles, setProfiles] = useAtom(profileEvents)

    const [accounts, setAccounts] = useAtom(accountsAtom);
    const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);

    const [age, setAge] = React.useState("testing.local");
    const handleChange = (event) => {
        setAge(event.target.value as string);
    }

    async function getDomains() {
        console.log("Let's fetch our events")
        console.log(accounts[selectedAccount])
        let signer = new NSecSigner(
            nip19.decode(accounts[selectedAccount].nsec).data,
        )
        let pubkey_to = nip19.decode(nip05npub).data
        console.log("pubkey_to")
        console.log(pubkey_to)
        const encrypted_text = await nip04.encrypt(
            nip19.decode(accounts[selectedAccount].nsec).data,
            pubkey_to,
            "/nip05 list-domains",
        );
        const signedEvent = await signer.signEvent({
            kind: 4,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ["p", pubkey_to],
            ],
            content: encrypted_text,
        })
        console.log("signedEvent")
        console.log(signedEvent)
        my_pool.event(signedEvent, { relays: [nip05Relay] })
        let filter = {
            kinds: [4],
            authors: [pubkey_to],
            limit: 1,
            "#p": [nip19.decode(accounts[selectedAccount].npub).data,]
        }
        console.log("\nFilter:")
        console.log(filter)
        // await new Promise(resolve => setTimeout(resolve, 4000));
        console.log("Running the Filter")
        for await (const msg of my_pool.req([filter], { relays: [nip05Relay] })) {
            if (msg[0] === "EVENT") {
                console.log("WE_GOT_EVENT_KIND_4_BACK")
                console.log(msg[2])
                console.log(msg[2].content)
                let decrypted_content = await nip04.decrypt(
                    nip19.decode(accounts[selectedAccount].nsec).data,
                    msg[2].pubkey,
                    msg[2].content,
                )
                console.log("decrypted_content")
                console.log(decrypted_content)
                if(decrypted_content.includes("Example Command Use Includes")){

                }
            }
            // if (msg[0] === "EOSE") break; // Sends a `CLOSE` message to the relay.
        }
        console.log("DID_THE_FILTER_RUN")

    }
    React.useEffect(() => {
        if (hasRun.current) return; // Skip if already run
        hasRun.current = true;
        getDomains()
    }, [])
    return (
        <>
            <Typography
                variant="h3"
                style={{ textAlign: "left", display: "flex" }}
            >
                Claim Your NIP05
            </Typography>
            <NostrAccountData
                mnemonic={accounts[selectedAccount].mnemonic}
                pubkey={accounts[selectedAccount].pubkey}
                privkey={accounts[selectedAccount].privkey}
                npub={accounts[selectedAccount].npub}
                nsec={accounts[selectedAccount].nsec}
            />
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <TextField
                    id="nip05Username"
                    label="nip05Username"
                    multiline
                    rows={1}
                    defaultValue=""
                    variant="standard"
                    value={nip05Username}
                    onChange={(e) => {
                        console.log(e.target.value)
                        setNip05Username(e.target.value)
                    }}
                />@<FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Age</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        label="Age"
                        onChange={handleChange}
                    >
                        <MenuItem value={"testing.local"}>testing.local</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <Button
                variant="contained"
                onClick={getDomains}
            >
                Fetch Domains
            </Button>
            <Button
                variant="contained"
                onClick={checkNIP05Claimed}
            >
                Check if NIP05 is Claimed
            </Button>
            <Button
                variant="contained"
                onClick={selectNewAccount}
                disabled={nip05UsernameValidity}
            >
                Claim NIP05 Username
            </Button>
            <Button variant="contained" onClick={selectNewAccount}>
                Next: Profile
            </Button>
        </>
    );
}
