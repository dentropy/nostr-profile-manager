import { useAtom } from "jotai";
import { appPageAtom } from "~/jotaiAtoms";

import AddNostrAccount from "./components/addNostrAccount";
import EditNostrProfile from "./components/editProfile";
import NostrProfiles from "./pages/nostrProfiles";

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
