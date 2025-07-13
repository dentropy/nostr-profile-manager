// import { generateMnemonic } from "bip39"
import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Snackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { CopyToClipboardButton } from "~/testComponents/copyToClipboard";
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
import {
  generateSeedWords,
  privateKeyFromSeedWords,
  validateWords,
} from "nostr-tools/nip06";

import { bytesToHex } from "nostr-tools/utils";
const style = {
  color: "black",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

import NostrAccountData from "~/components/NostrAccountData";
export function CreateDevNostrAccount() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const [snackBarText, setSnackBarText] = React.useState("");
  const handleCloseAction = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleCloseAction}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseAction}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );


  const [mnemonic , setMnemonic] = React.useState(generateSeedWords());
  const mnemonic_validation = validateWords(mnemonic);
  const [secretKey, setSecretKey] = React.useState(privateKeyFromSeedWords(mnemonic, "", 0))
  const [publicKey, setPublicKey] = React.useState(getPublicKey(secretKey))
  const [nsec, setNsec ] = React.useState(nip19.nsecEncode(secretKey))
  const [npub, setNpub ] = React.useState(nip19.npubEncode(publicKey))

  const handleClick = (save_to_clipboard) => {
    console.log("TEST_FROM_DENT");
    console.log(save_to_clipboard)
    navigator.clipboard.writeText(save_to_clipboard)
    setSnackBarText(`Copied "${save_to_clipboard}"`)
    setSnackBarOpen(true)
  };
  return (
    <>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={handleCloseAction}
        message={snackBarText}
        action={action}
      />
      <Button
        variant="contained"
        onClick={handleOpen}
      >
        Create Development Nostr Account
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <NostrAccountData />
        {/* <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            onClick={(e) => {
              e.preventDefault();
              handleClick(mnemonic);
            }}
          >
            ⎘Mnemonic: <br></br> {mnemonic}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            onClick={(e) => {
              e.preventDefault();
              handleClick(nsec);
            }}
          >
            ⎘NSEC: <br></br>{nsec}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            onClick={(e) => {
              e.preventDefault();
              handleClick(npub);
            }}
          >
            ⎘NPUB: <br></br> {npub}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            onClick={(e) => {
              e.preventDefault();
              handleClick(bytesToHex(secretKey));
            }}
          >
            ⎘Hex Secret Key: <br></br> {bytesToHex(secretKey)}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            onClick={(e) => {
              e.preventDefault();
              handleClick(publicKey);
            }}
          >
            ⎘Hex Public Key: <br></br>{publicKey}
          </Typography>
          <Button             onClick={(e) => {
              e.preventDefault();
              handleClick(JSON.stringify({mnemonic: mnemonic, nsec: nsec, npub: npub, publicKey: publicKey, secretKey: bytesToHex(secretKey)},null, 2));
            }}>Copy Everything as JSON</Button>
        </Box> */}
      </Modal>
    </>
  );
}
