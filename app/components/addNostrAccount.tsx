import { useAtom } from "jotai";
import { appPageAtom } from "~/jotaiAtoms";

import { Box } from "@mui/material";
import { CreateDevNostrAccount } from "../modals/createDevNostrAccountModal";
import { MnemonicModal } from "../modals/mnemonicmodal";
import { NSECModal } from "../modals/nsecmodal";
import { ToggleRelayList } from "./selectRelays";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
export default function AddNostrAccount() {
  const [appPage, setAppPage] = useAtom(appPageAtom);
  const selectNewAccount = () => {
    setAppPage({ page: "New Account Keys" });
  };
  const selectExistingAccountNSEC = () => {
    setAppPage({ page: "Existing Account NSEC" });
  };
  return (
    <>
      <Typography
        variant="h3"
        style={{ textAlign: "left", display: "flex" }}
      >
        Create a New Account
      </Typography>
      <Button
        variant="contained"
        onClick={selectNewAccount}
      >
        Login via NSEC or privkey
      </Button>
      <Typography
        variant="h3"
        style={{ textAlign: "left", display: "flex" }}
      >
        Load an Existing Nostr Profile
      </Typography>
      {/* <NSECModal /> */}
      <Button variant="contained" onClick={selectExistingAccountNSEC}>
        Input NSEC, NPUB, or HEX Key
      </Button>
      <MnemonicModal />
      <Typography
        variant="h3"
        style={{ textAlign: "left", display: "flex" }}
      >
        Developer Featuers
      </Typography>
      <CreateDevNostrAccount />
    </>
  );
}
