import { useAtom } from "jotai";
import { appPageAtom } from "~/jotaiAtoms";

import { Box } from "@mui/material";
import { CreateDevNostrAccount } from "../modals/createDevNostrAccountModal";
import { MnemonicModal } from "../modals/mnemonicmodal";
import { ToggleRelayList } from "./ToggleRelayList";
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
  const selectExtensonLogin = () => {
    setAppPage({ page: "Extension Login" });
  };

  const PublishTestProfile = () => {
    setAppPage({ page: "Publish Test Profile" });
  };

  const ClaimNIP05 = () => {
    setAppPage({ page: "Claim Your NIP05" });
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
        Create a New Account
      </Button>
      <Typography
        variant="h3"
        style={{ textAlign: "left", display: "flex" }}
      >
        Load an Existing Nostr Profile
      </Typography>
      <Button variant="contained" onClick={selectExistingAccountNSEC}>
        Input NSEC, NPUB, or HEX Key
      </Button>
      <MnemonicModal />
      <Button
        disabled={!Object.keys(window).includes("nostr")}
        variant="contained" 
        onClick={selectExtensonLogin}>
        Login Via Extension
      </Button>
      <Typography
        variant="h3"
        style={{ textAlign: "left", display: "flex" }}
      >
        Claim Your NIP05
      </Typography>
      <Button
        variant="contained"
        onClick={ClaimNIP05}
      >
        Claim Your NIP05
      </Button>
      <Typography
        variant="h3"
        style={{ textAlign: "left", display: "flex" }}
      >
        Developer Featuers
      </Typography>
      <CreateDevNostrAccount />
      <Button
        variant="contained"
        onClick={PublishTestProfile}
      >
        Publish Test Profile
      </Button>
    </>
  );
}
