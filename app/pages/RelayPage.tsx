import React from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAtom } from "jotai";
import { editProfileEventId, accountsAtom, profileEvents, relayWebSocketsAtom, masterRelayList } from "~/jotaiAtoms";

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { JsonEditor } from 'json-edit-react'
import { ToggleRelayList } from "~/components/ToggleRelayList";
export function RelayPage() {
    const [relayObj, setRealyObj] = useAtom(masterRelayList);

      const [, forceUpdate] = React.useReducer((x) => x + 1, 0);


    return (
        <>
            <Typography
                variant="body3"
                style={{ textAlign: "left", display: "flex" }}
            >
                Your Selected Relays<br></br>
            </Typography>
            <SyntaxHighlighter language="json" style={docco}>
                {JSON.stringify(relayObj, null, 2)}
            </SyntaxHighlighter>
            <Typography
                variant="body3"
                style={{ textAlign: "left", display: "flex" }}
            >
                Select Your Relays<br></br>
            </Typography>
            {/* <JsonEditor
                data={SOME_JSON_DATA}
                setData={update_selected_relays}
            /> */}
            {/* <ToggleRelayList></ToggleRelayList> */}

        </>

    );
}
