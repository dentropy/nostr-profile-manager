import { useAtom } from "jotai";
import { appPageAtom, accountsAtom } from "~/jotaiAtoms";

import NostrAccountData from "~/components/nostrAccountData";
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
import { Button } from "@mui/material";

export default function NewAccountKeys() {
  const [appPage, setAppPage] = useAtom(appPageAtom);

  const selectNewAccount = () => {
    setAppPage({ page: "New Account Profile" });
  };
  return (
    <>
      <h1>Copy and save this somewhere or your will lose your account</h1>
      <NostrAccountData />
      <Button variant="contained" onClick={selectNewAccount}>
        Next: Profile
      </Button>
    </>
  );
}
