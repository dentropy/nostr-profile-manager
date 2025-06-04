// import { generateMnemonic } from "bip39"
import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
import {
  generateSeedWords,
  privateKeyFromSeedWords,
  validateWords,
} from "nostr-tools/nip06";

const style = {
  color: "black",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function CreateNostrAccount() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const mnemonic = generateSeedWords();
  const mnemonic_validation = validateWords(mnemonic);
  const secret_key = privateKeyFromSeedWords(mnemonic, "", 0);
  const public_key = getPublicKey(secret_key);
  const nsec = nip19.nsecEncode(secret_key);
  const npub = nip19.npubEncode(public_key);

  return (
    <>
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
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {mnemonic}
          </Typography>
          <br />
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {secret_key}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {public_key}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {nsec}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {npub}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
