import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Button } from '@mui/material';

import { useAtom } from "jotai";

import { relayListAtom, selectedRelayListAtom } from "~/jotaiAtoms";

export function ToggleRelayList() {
    const [view, setFormats] = React.useState('list')
    const [relayList, setRealyList] = useAtom(relayListAtom);
    const [selectedRelays, setSelectedRelays] = useAtom(selectedRelayListAtom);
    const handleFormat = (
        event: React.MouseEvent<HTMLElement>,
        newFormats: string[],
    ) => {
        console.log("newFormats")
        console.log(newFormats)
        let copyRelayList = [...selectedRelays]
        console.log(copyRelayList)
        if (!copyRelayList.includes(newFormats)) {
            copyRelayList.push(newFormats)
        } else {
            copyRelayList = copyRelayList.filter(item => item !== newFormats);
        }
        setSelectedRelays(copyRelayList);
    };


    return (
        <ToggleButtonGroup
            color="primary"
            orientation="vertical"
            value={selectedRelays}
            exclusive
            onChange={handleFormat}
        >
            {relayList.map((str, index) => (
                <ToggleButton value={str} aria-label="bold">
                    {str}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}