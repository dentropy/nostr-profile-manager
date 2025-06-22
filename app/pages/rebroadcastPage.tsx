import React from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAtom } from "jotai";
import { editProfileEventId, accountsAtom, profileEvents, selectedRelayListAtom, relayWebSocketsAtom } from "~/jotaiAtoms";

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { rxNostr } from "~/pages/index"

import { ToggleRelayList } from "~/components/selectRelays";
export function RebroadcastPage() {
    const [editEventId, setEventId] = useAtom(editProfileEventId)
    const [profiles, setProfiles] = useAtom(profileEvents)
    const [accounts, setAccounts] = useAtom(accountsAtom)
    const [selectedRelays, setSelectedRelays] = useAtom(selectedRelayListAtom);
    const [relayWebSockets, setRelayWebSockets] = useAtom(relayWebSocketsAtom);

    let project_content = Object.assign({}, profiles[editEventId].ui_data.json_content);
    let minimumProfileKeys = [
        'name',
        'display_name',
        'nip05',
        'about',
        'picture',
        'banner',
        'website'
    ]
    minimumProfileKeys.forEach(str => {
        if (!(str in project_content)) {
            project_content[str] = ""; // or any default value
        }
    });
    const [profileJsonData, setProfileJsonData] = React.useState(project_content);

    async function publishEvents() {
        let result = rxNostr.send(
            profiles[editEventId].raw_event,
            {
                relays: selectedRelays
            }
        )
        console.log("publishEvents")
        console.log(result)
    }
    return (
        <Card sx={{ width: "80%", margin: "50px" }}>
            <Typography
                variant="body3"
                style={{ textAlign: "left", display: "flex" }}
            >
                WARNING, WON'T REPLACE ON RELAYS WITH A PROFILE ALREADY SAVED, BETTER TO EDIT AND PUBLISH THE SAME THING
            </Typography>
            <br></br>
            <SyntaxHighlighter language="json" style={docco}>
                {JSON.stringify(profiles[editEventId].ui_data, null, 2)}
            </SyntaxHighlighter>
            <br></br>
            <br></br>
            <ToggleRelayList></ToggleRelayList>
            <br></br>
            <br></br>
            <Button variant="contained" onClick={publishEvents}>Publish To These Relays</Button>
        </Card>
        
    );
}
