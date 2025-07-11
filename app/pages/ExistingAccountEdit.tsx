import { useAtom } from "jotai";
import { appPageAtom } from "~/jotaiAtoms";

import EditNostrProfile from "~/components/EditNostrProfile";
import { Button } from "@mui/material";


import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alignProperty } from "node_modules/@mui/material/esm/styles/cssUtils";
import React from "react";

import { editProfileEventId, accountsAtom, profileEvents } from "~/jotaiAtoms";
import { ToggleRelayList } from "../components/selectRelays";
import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent, nip19 } from 'nostr-tools'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
import { JsonEditor } from 'json-edit-react'
import { rxNostr } from "~/index"
import { verifier, seckeySigner } from "@rx-nostr/crypto";
import { relayListAtom, selectedRelayListAtom, relayWebSocketsAtom } from "~/jotaiAtoms";

export default function ExistingAccountEdit() {
  const [accounts, setAccounts] = useAtom(accountsAtom)
  const [appPage, setAppPage] = useAtom(appPageAtom);
  const [selectedRelays, setSelectedRelays] = useAtom(selectedRelayListAtom);
  
  const selectNewAccount = () => {
    setAppPage({ page: "New Account Profile" });
  };
    async function publishEvents() {
        let result = rxNostr.send(
            {
                kind: 0,
                content: JSON.stringify(profileJsonData),
            },
            {
                relays: selectedRelays,
                signer: seckeySigner(accounts[0].nsec)
            }
        )
        console.log("publishEvents")
        console.log(result)
    }
  return (
    <>
      <h1>Copy and save this somewhere or your will lose your account</h1>
      <EditNostrProfile></EditNostrProfile>
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
