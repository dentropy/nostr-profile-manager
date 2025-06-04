import { CreateNostrAccount } from "./createNostrAccount";
import { MnemonicModal } from "./mnemonicmodal";
import { NSECModal } from "./nsecmodal";

export default function AddNostrAccount() {
  return (
    <>
      <CreateNostrAccount />
      <NSECModal />
      <MnemonicModal />
    </>
  );
}
