import { CreateDevNostrAccount } from "../modals/createDevNostrAccountModal";
import { MnemonicModal } from "../modals/mnemonicmodal";
import { NSECModal } from "../modals/nsecmodal";
import { ToggleRelayList } from "./selectRelays";
export default function LoginNostrAccount() {
  return (
    <>
      <CreateDevNostrAccount />
      <LoginNostrAccount />
      <NSECModal />
    </>
  );
}
