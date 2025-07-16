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
import { appPageAtom } from "~/jotaiAtoms";
import { PageSelect } from "~/PageSelect";

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

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
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
