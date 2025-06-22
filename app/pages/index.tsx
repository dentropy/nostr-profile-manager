import * as React from "react";

import { verifier } from "@rx-nostr/crypto";
import { createRxForwardReq, createRxNostr } from "rx-nostr";
import { DEFAULT_USERMETA_RELAYS } from "~/relays";
export const rxReq = createRxForwardReq();
export const rxNostr = createRxNostr({ verifier });
rxNostr.setDefaultRelays(DEFAULT_USERMETA_RELAYS);
import { useAtom } from "jotai";
import { profileEvents } from "~/jotaiAtoms";
import { accountsAtom } from "~/jotaiAtoms";
import { appPageAtom } from "~/jotaiAtoms";

import NostrAppBar from "../components/NostrAppBar";
import PageSelect from "../pageSelect";

export function Welcome() {
  const [accounts, setAccounts] = useAtom(accountsAtom);
  const [profileData, setProfileData] = useAtom(profileEvents);
  const [appPage, setAppPage] = useAtom(appPageAtom);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  rxNostr.use(rxReq).subscribe((packet) => {
    // This is your application!
    const relay_data: any = profileData;
    if (packet.event.id in relay_data) {
      if (!relay_data[packet.event.id].ui_data.from.includes(packet.from)) {
        relay_data[packet.event.id].ui_data.from.push(packet.from);
      }
    } else {
      relay_data[packet.event.id] = {
        ui_data: {
          from: [packet.from],
          id: packet.event.id,
          json_content: JSON.parse(packet.event.content),
          created_at: packet.event.created_at,
          pubkey: packet.event.pubkey,
        },
        raw_event: packet.event
      };
    }
    // console.log("relay_data")
    // console.log(relay_data)
    setProfileData(profileData);
    console.log("THE LENGTH");
    console.log(Object.keys(profileData).length);
    forceUpdate();
  });

  React.useEffect(() => {
    if (accounts.length >= 1) {
      console.log("EMIT THE DATA PLZ");
      console.log(accounts[0].pubkey);
      rxReq.emit({
        kinds: [0],
        authors: [accounts[0].pubkey],
      });
      console.log(profileData);
    }
  }, [accounts]);

  return (
    <>
      <NostrAppBar />
      <main className="flex items-center justify-center pt-16 pb-4">
        <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
          <PageSelect />
          <button onClick={forceUpdate}>Force Re-render</button>
        </div>
      </main>
    </>
  );
}
