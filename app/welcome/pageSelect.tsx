import { useAtom } from "jotai";
import { appPageAtom } from "~/jotaiAtoms";

import AddNostrAccount from "./addNostrAccount";
import EditNostrProfile from "./editProfile";
import NostrProfiles from "./nostrProfiles";

export default function PageSelect() {
  const [appPage, setAppPage] = useAtom(appPageAtom);
  if (appPage.page == "Add Account") {
    return (
      <>
        <AddNostrAccount />
        <NostrProfiles />
      </>
    );
  }
  if (appPage.page == "Profiles") {
    return (
      <>
        <NostrProfiles />
      </>
    );
  }
  if (appPage.page == "Edit Profile") {
    return (
      <>
        <EditNostrProfile />
      </>
    );
  }
}
