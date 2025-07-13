import * as React from "react";

import { verifier } from "@rx-nostr/crypto";
import {
  createRxBackwardReq,
  createRxForwardReq,
  createRxNostr,
} from "rx-nostr";
import { DEFAULT_USERMETA_RELAYS } from "~/relays";
export const rxReq = createRxBackwardReq();
export const rxNostr = createRxNostr({ verifier });
rxNostr.setDefaultRelays(DEFAULT_USERMETA_RELAYS);

import { useAtom } from "jotai";
import { profileEvents } from "~/jotaiAtoms";
import { accountsAtom } from "~/jotaiAtoms";
import { appPageAtom, NIP33Data } from "~/jotaiAtoms";
import PageSelect from "./PageSelect";

function findFirstMatch(string_list: String[], target: String) {
  for (let str of string_list) {
    console.log("str");
    console.log(str);
    if (str[0] === target) return str;
  }
  return null; // Return null if no match is found
}



export function Welcome() {
  const [accounts, setAccounts] = useAtom(accountsAtom);
  const [profileData, setProfileData] = useAtom(profileEvents);
  const [appPage, setAppPage] = useAtom(appPageAtom);
  const [nip33Data, setNIP33Data] = useAtom(NIP33Data);

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    // let relay_url = "wss://purplepag.es/"
    // const relay = new NRelay1(relay_url);
    // console.log("Loading in rxNostr")
    // rxNostr.use(rxReq).subscribe({
    //   next: (packet) => {
    //     console.log("Received:", packet);
    //   },
    //   complete: () => {
    //     console.log("Completed!");
    //   },
    // });
  }, []);

  // // For NIP33 Stuff
  // rxNostr.use(rxReq).subscribe((packet) => {
  //   // This is your application!
  //   if (packet.event.kind == 0) {
  //     const relay_data: any = profileData;
  //     if (packet.event.id in relay_data) {
  //       if (!relay_data[packet.event.id].ui_data.from.includes(packet.from)) {
  //         relay_data[packet.event.id].ui_data.from.push(packet.from);
  //       }
  //     } else {
  //       relay_data[packet.event.id] = {
  //         ui_data: {
  //           from: [packet.from],
  //           id: packet.event.id,
  //           json_content: JSON.parse(packet.event.content),
  //           created_at: packet.event.created_at,
  //           pubkey: packet.event.pubkey,
  //         },
  //         raw_event: packet.event
  //       };
  //     }
  //     setProfileData(profileData);
  //     forceUpdate();
  //   }
  //   if (packet.event.kind == 30166) {
  //     const nip_33_data: any = nip33Data;
  //     if (!Object.keys(nip_33_data.events).includes(packet.event.id)) {
  //       nip_33_data.events[packet.event.id] = packet.event
  //     }
  //     console.log("relay_data")
  //     console.log(JSON.stringify(nip_33_data.relay_list, null, 2))
  //     console.log(packet.event.tags)
  //     let relay: any = findFirstMatch(packet.event.tags, "d")
  //     console.log("RELAY_DATA")
  //     console.log(relay)
  //     console.log()
  //     if (relay != null) {
  //       if (!Object.keys(nip_33_data.relay_list).includes(relay[1])) {
  //         nip_33_data.relay_list[relay[1]] = {enabled: false}
  //         setNIP33Data(nip_33_data)
  //         forceUpdate();
  //       }
  //     }
  //   }
  // });

  // React.useEffect(() => {
  //   if (accounts.length >= 1) {
  //     console.log("EMIT THE DATA PLZ");
  //     console.log(accounts[0].pubkey);
  //     rxReq.emit({
  //       kinds: [0],
  //       authors: [accounts[0].pubkey],
  //     });
  //     console.log(profileData);
  //   }
  // }, [accounts]);

  return (
    <>
      <main className="flex items-center justify-center pt-16 pb-4">
        <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
          <PageSelect />
          <button onClick={forceUpdate}>Force Re-render</button>
        </div>
      </main>
    </>
  );
}
