import { useAtom } from "jotai";
import { appPageAtom } from "~/jotaiAtoms";

import AddNostrAccount from "./components/addNostrAccount";
import NostrProfiles from "./pages/nostrProfiles";
import { RebroadcastPage } from "./pages/rebroadcastPage";
import { RelayPage } from "./pages/RelayPage";
import NewAccountProfile from "./pages/NewAccountProfile";
import NewAccountKeys from "./pages/NewAccountKeys";
import NewAccountRelays from "./pages/NewAccountRelays";
import ExistingAccountEdit from "./pages/ExistingAccountEdit";
import NewAccountPublishProfile from "./pages/NewAccountPublishProfile";
import NewAccountVerifyPublishedProfile from "./pages/NewAccountVerifyPublishedProfile";
import ExistingAccountNSEC from "~/pages/ExistingAccountNSEC";
import FetchingProfilePage from "./pages/FetchingProfilePage";
import { PublishTestProfile } from "./pages/PublishTestProfile";

export function PageSelect() {
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
        <ExistingAccountEdit />
      </>
    );
  }
  if (appPage.page == "Rebroadcast Profile") {
    return (
      <>
        <RebroadcastPage />
      </>
    );
  }
  if (appPage.page == "Relay Select") {
    return (
      <>
        <RelayPage />
      </>
    );
  }
  if (appPage.page == "New Account Keys") {
    return (
      <>
        <NewAccountKeys />
      </>
    );
  }
  if (appPage.page == "New Account Profile") {
    return (
      <>
        <NewAccountProfile />
      </>
    );
  }
  if (appPage.page == "New Account Relays") {
    return (
      <>
        <NewAccountRelays />
      </>
    );
  }
  if (appPage.page == "New Account Publish Profile") {
    return (
      <>
        <NewAccountPublishProfile />
      </>
    );
  }
  if (appPage.page == "New Account Verify Published Profile") {
    return (
      <>
        <NewAccountVerifyPublishedProfile />
      </>
    );
  }
  if (appPage.page == "Existing Account NSEC") {
    return (
      <>
        <ExistingAccountNSEC />
      </>
    );
  }
  if (appPage.page == "Fetching Profile Page") {
    return (
      <>
        <FetchingProfilePage />
      </>
    );
  }
  if (appPage.page == "Publish Test Profile") {
    return (
      <>
        <PublishTestProfile />
      </>
    );
  }
}
