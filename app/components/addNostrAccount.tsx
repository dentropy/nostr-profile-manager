import { CreateNostrAccount } from "../modals/createNostrAccountModal";
import { MnemonicModal } from "../modals/mnemonicmodal";
import { NSECModal } from "../modals/nsecmodal";
import { ToggleRelayList } from "./selectRelays";
export default function AddNostrAccount() {
  return (
    <>
      <CreateNostrAccount />
      <NSECModal />
      <MnemonicModal />
      <ToggleRelayList></ToggleRelayList>
    </>
  );
}
