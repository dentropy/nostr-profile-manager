import React from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAtom } from "jotai";
import { editProfileEventId, accountsAtom, profileEvents, selectedRelayListAtom, relayWebSocketsAtom, NIP33Data } from "~/jotaiAtoms";

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { JsonEditor } from 'json-edit-react'

// import { rxReq } from "~/pages/index"
// import { verifier } from "@rx-nostr/crypto";
// import { createRxForwardReq, createRxNostr } from "rx-nostr";
// export const rxNostr = createRxNostr({ verifier });

import { ToggleRelayList } from "~/components/selectRelays";
export function RelayPage() {
    const [editEventId, setEventId] = useAtom(editProfileEventId)
    const [profiles, setProfiles] = useAtom(profileEvents)
    const [accounts, setAccounts] = useAtom(accountsAtom)
    const [selectedRelays, setSelectedRelays] = useAtom(selectedRelayListAtom);
    const [relayWebSockets, setRelayWebSockets] = useAtom(relayWebSocketsAtom);
    const [nip33Data, setNIP33Data] = useAtom(NIP33Data);

      const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
    // rxNostr.use(rxReq).subscribe((packet) => {
    //     if (packet.event.kind == 30166) {
    //         const relay_data: any = nip33Data;
    //         if (!Object.keys(relay_data.events).includes(packet.event.id)) {
    //             relay_data.events[packet.event.id] = packet.event
    //         }
    //         console.log("relay_data")
    //         console.log(relay_data)
    //         setNIP33Data(relay_data)
    //     }
    // })



    // React.useEffect(() => {
    //     rxReq.emit({ kinds: [30166], limit: 5 })
    // }, []);

    function update_selected_relays(input_Data: any) {
        const nip_33_data: any = nip33Data;
        nip_33_data.relay_list = input_Data
        nip_33_data.enabled_relays = []
        for (const relay of Object.keys(input_Data)) {
            if (Object.keys(input_Data[relay]).includes("enabled")) {
                if (input_Data[relay].enabled) {
                    console.log("PUSHING")
                    nip_33_data.enabled_relays.push(relay)
                }
            }
        }
        nip_33_data.enabled_relays.sort()
        setNIP33Data(nip_33_data)
        forceUpdate()
    }

    return (
        <>
            <Typography
                variant="body3"
                style={{ textAlign: "left", display: "flex" }}
            >
                Your Selected Relays<br></br>
            </Typography>
            <SyntaxHighlighter language="json" style={docco}>
                {JSON.stringify(nip33Data.enabled_relays, null, 2)}
            </SyntaxHighlighter>
            <Typography
                variant="body3"
                style={{ textAlign: "left", display: "flex" }}
            >
                Select Your Relays<br></br>
            </Typography>
            <JsonEditor
                data={nip33Data.relay_list}
                setData={update_selected_relays}
            />
            {/* <ToggleRelayList></ToggleRelayList> */}

        </>

    );
}
