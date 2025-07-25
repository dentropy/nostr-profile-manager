// import { generateMnemonic } from "bip39"
import * as React from "react";

import { useAtom } from "jotai";
import { appPageAtom, accountsAtom, selectedAccountAtom, profileEvents, editProfileEventId } from "~/jotaiAtoms";


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


  const [mnemonic, setMnemonic] = React.useState(generateSeedWords());
  const mnemonic_validation = validateWords(mnemonic);
  const [secretKey, setSecretKey] = React.useState(privateKeyFromSeedWords(mnemonic, "", 0))
  const [publicKey, setPublicKey] = React.useState(getPublicKey(secretKey))
  const [nsec, setNsec] = React.useState(nip19.nsecEncode(secretKey))
  const [npub, setNpub] = React.useState(nip19.npubEncode(publicKey))

  const [accounts, setAccounts] = useAtom(accountsAtom);
  const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
  const handleClick = (save_to_clipboard) => {
    navigator.clipboard.writeText(save_to_clipboard)
    setSnackBarText(`Copied "${save_to_clipboard}"`)
    setSnackBarOpen(true)
  };
  const [tmpAccount, setTmpAccount] = React.useState({
    mnemonic: "PLACEHOLDER",
    nsec: "PLACEHOLDER",
    npub: "PLACEHOLDER",
    privkey: "PLACEHOLDER",
    pubkey: "PLACEHOLDER",
    secretKey: "PLACEHOLDER"
  })

  React.useEffect(() => {
    let account_type_list = []
    for (const tmp_account of Object.keys(accounts)) {
      console.log("PAUL_WAS_HERE")
      console.log(tmp_account)
      account_type_list.push(accounts[tmp_account].type)
      if (accounts[tmp_account].type == "TESTING") {
        setSelectedAccount(accounts[tmp_account].pubkey)
      }
    }
    console.log(!account_type_list.includes("TESTING"))
    if (!account_type_list.includes("TESTING")) {
      console.log("TRYING_TO_ADD_ACCOUNT")
      let mnemonic = generateSeedWords()
      let secretKey = privateKeyFromSeedWords(mnemonic, "", 0)
      let nsec = nip19.nsecEncode(secretKey)
      let publicKey = getPublicKey(secretKey)
      let npub = nip19.npubEncode(publicKey)
      let pubkey = getPublicKey(nip19.decode(nsec).data)
      let accountsData = {
        type: "TESTING",
        mnemonic: mnemonic,
        nsec: nsec,
        npub: npub,
        privkey: bytesToHex(nip19.decode(nsec).data),
        pubkey: getPublicKey(nip19.decode(nsec).data),
        secretKey: secretKey
      }
      console.log(accountsData)
      setSelectedAccount(accountsData.pubkey)
      setAccounts((prevState) => ({
        ...prevState, // Spread the previous state to keep other keys
        [pubkey]: accountsData,
      }))
      setSelectedAccount(pubkey)
    }
  }, [])
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
                <NostrAccountData
                    mnemonic={accounts[selectedAccount].mnemonic}
                    pubkey={accounts[selectedAccount].pubkey}
                    privkey={accounts[selectedAccount].privkey}
                    npub={accounts[selectedAccount].npub}
                    nsec={accounts[selectedAccount].nsec}
                ></NostrAccountData>
      </Modal>
    </>
  );
}
