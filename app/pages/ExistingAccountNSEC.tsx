import { useAtom } from "jotai";
import { appPageAtom, selectedAccountAtom } from "~/jotaiAtoms";

import EditNostrProfile from "~/components/EditNostrProfile";
import { Button } from "@mui/material";
import { RelayPage } from "./RelayPage";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
import * as React from "react";
import { useState } from "react";

import { bytesToHex } from "nostr-tools/utils";
import { accountsAtom } from "~/jotaiAtoms";

const style = {
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
};
export default function ExistingAccountNSEC() {
    const [nsecValid, setNSECValid] = React.useState(true);
    const [accounts, setAccounts] = useAtom(accountsAtom);
    const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
    const [nsec, setNSEC] = React.useState("");
    const onNSECChange = (event: any) => {
        try {
            const { type, data } = nip19.decode(event.target.value);
            setNSECValid(false);
        } catch (error) {
            setNSECValid(true);
        }
        setNSEC(event.target.value);
    };
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const prevousPage = () => {
        setAppPage({ page: "Add Account" });
    };
    const nextPage = () => {
        setAppPage({ page: "New Account Verify Published Profile" });
    };
    const addAccount = () => {
        
        let accountsData =
            {
                nsec,
                npub: nip19.npubEncode(getPublicKey(nip19.decode(nsec).data)),
                privkey: bytesToHex(nip19.decode(nsec).data),
                pubkey: getPublicKey(nip19.decode(nsec).data),
                secretKey: nip19.decode(nsec).data
            }
        console.log("accountsData")
        console.log(accountsData)
        setAccounts((prevItems) => ({
            ...prevItems,
            [accountsData.pubkey]: accountsData
        }))
        setSelectedAccount(accountsData.pubkey)
        // async function fetchData() {
        //     for await (const msg of myrelay.req([filter])) {
        //         if (msg[0] === "EVENT") console.log(msg[2]);
        //         if (msg[0] === "EOSE") break; // Sends a `CLOSE` message to the relay.
        //     }
        // }
        // fetchData();
    };

    return (
        <>
            <Box>
                <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                >
                    Please Input a NSEC, NPUB, or HEX Key
                </Typography>
                <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2 }}
                >
                    Duis mollis, est non commodo luctus, nisi erat porttitor
                    ligula.
                </Typography>
                <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2 }}
                >
                    nsecValid={JSON.stringify(nsecValid)}
                </Typography>
                <TextField
                    error={nsecValid}
                    id="outlined-basic"
                    label="Outlined"
                    variant="outlined"
                    onChange={onNSECChange}
                    value={nsec}
                />
                <Button
                    disabled={nsecValid}
                    variant="contained"
                    onClick={addAccount}
                >
                    Add Account
                </Button>
            </Box>
            <Button variant="contained" onClick={prevousPage}>
                Previouis: New Account Profile
            </Button>
            <Button variant="contained" onClick={nextPage}>
                Next: New Account Publish Profile
            </Button>
        </>
    );
}
