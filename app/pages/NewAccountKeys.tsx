import * as React from "react";

import { useAtom } from "jotai";
import { appPageAtom, accountsAtom, selectedAccountAtom, profileEvents, editProfileEventId } from "~/jotaiAtoms";

import NostrAccountData from "~/components/NostrAccountData";
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
import { Button } from "@mui/material";

import {
  generateSeedWords,
  privateKeyFromSeedWords,
  validateWords,
} from "nostr-tools/nip06";
import { bytesToHex } from "nostr-tools/utils";

export default function NewAccountKeys() {
  const [appPage, setAppPage] = useAtom(appPageAtom);

  const selectNewAccount = () => {
    setAppPage({ page: "New Account Profile" });
  }
  const [profiles, setProfiles] = useAtom(profileEvents)

  const [accounts, setAccounts] = useAtom(accountsAtom);
  const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
  const [editEventId, setEventId] = useAtom(editProfileEventId);
  const [tmpAccount, setTmpAccount] = React.useState({
    mnemonic: "PLACEHOLDER",
    nsec: "PLACEHOLDER",
    npub: "PLACEHOLDER",
    privkey: "PLACEHOLDER",
    pubkey: "PLACEHOLDER",
    secretKey: "PLACEHOLDER"
  })
  const addAccount = () => {
    if (selectedAccount != undefined && selectedAccount.length != 0) {
      setTmpAccount(accounts[selectedAccount])
    } else {
      let mnemonic = generateSeedWords()
      let secretKey = privateKeyFromSeedWords(mnemonic, "", 0)
      let nsec = nip19.nsecEncode(secretKey)
      let publicKey = getPublicKey(secretKey)
      let npub = nip19.npubEncode(publicKey)
      let pubkey = getPublicKey(nip19.decode(nsec).data)
      let account_data = {
        mnemonic: mnemonic,
        nsec: nsec,
        npub: npub,
        privkey: bytesToHex(nip19.decode(nsec).data),
        pubkey: getPublicKey(nip19.decode(nsec).data),
        secretKey: secretKey
      }
      setTmpAccount(account_data)
      setAccounts((prevState) => ({
        ...prevState, // Spread the previous state to keep other keys
        [pubkey]: account_data,
      }))
      setSelectedAccount(pubkey)
      let profileData: any = {}
      profileData[pubkey] = { "json_content": {} }
      setProfiles(profileData)
      setEventId(pubkey)
    }
  };
  React.useEffect(() => {
    addAccount()
  }, [])
  return (
    <>
      <h1>Copy and save this somewhere or your will lose your account</h1>
      <NostrAccountData
        mnemonic={tmpAccount.mnemonic}
        pubkey={tmpAccount.pubkey}
        privkey={tmpAccount.privkey}
        npub={tmpAccount.npub}
        nsec={tmpAccount.nsec}
      />
      {/* <pre>{JSON.stringify(tmpAccount, null, 2)}</pre> */}
      <Button variant="contained" onClick={selectNewAccount}>
        Next: Profile
      </Button>
    </>
  );
}
