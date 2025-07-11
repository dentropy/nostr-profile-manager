import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
import * as React from "react";
import { useState } from "react";

import { useAtom } from "jotai";
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

export function NSECModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [nsecValid, setNSECValid] = React.useState(true);
  const [nsec, setNSEC] = React.useState("");
  const [accounts, setAccounts] = useAtom(accountsAtom);

  const onNSECChange = (event: any) => {
    try {
      const { type, data } = nip19.decode(event.target.value);
      setNSECValid(false);
    } catch (error) {
      setNSECValid(true);
    }
    setNSEC(event.target.value);
  };

  const addAccount = () => {
    setAccounts([
      {
        nsec,
        npub: nip19.npubEncode(getPublicKey(nip19.decode(nsec).data)),
        privkey: nip19.decode(nsec).data,
        pubkey: getPublicKey(nip19.decode(nsec).data),
      },
    ]);
  };
  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpen}
      >
        Login via NSEC or privkey
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
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
      </Modal>
    </div>
  );
}
