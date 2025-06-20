import { CreateNostrAccount } from "../modals/createNostrAccountModal";
import { MnemonicModal } from "../modals/mnemonicmodal";
import { NSECModal } from "../modals/nsecmodal";

export default function AddNostrAccount() {
  return (
    <>
      <CreateNostrAccount />
      <NSECModal />
      <MnemonicModal />
    </>
  );
}
