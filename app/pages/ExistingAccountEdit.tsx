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

import { accountsAtom, editProfileEventId, profileEvents } from "~/jotaiAtoms";
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
  masterRelayList,
  relayWebSocketsAtom,
  selectedAccountAtom,
} from "~/jotaiAtoms";

export default function ExistingAccountEdit() {
  const [accounts, setAccounts] = useAtom(accountsAtom)
  const [appPage, setAppPage] = useAtom(appPageAtom)

  const [relayObj, setRealyObj] = useAtom(masterRelayList)

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
        relays: relayObj.relay_url_list["default"].urls,
        signer: seckeySigner(accounts[selectedAccount].nsec),
      },
    );
    console.log("publishEvents");
    console.log(result);
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
      <Button variant="contained" onClick={publishEvents}>
        Publish Updated Profile
      </Button>
    </>
  );
}
