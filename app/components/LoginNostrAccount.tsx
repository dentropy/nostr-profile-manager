import { CreateDevNostrAccount } from "../modals/createDevNostrAccountModal";
import { MnemonicModal } from "../modals/mnemonicmodal";
import { NSECModal } from "../modals/nsecmodal";
import { ToggleRelayList } from "./ToggleRelayList";
export default function LoginNostrAccount() {
  return (
    <>
      <CreateDevNostrAccount />
      <LoginNostrAccount />
      <NSECModal />
    </>
  );
}
