import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { useAtom } from "jotai";

import { masterRelayList, selectedRelayGroup } from "~/jotaiAtoms";
import { Box, Button, TextField, Typography } from "@mui/material";
export function EditRelayList() {
    const [relayObj, setRealyObj] = useAtom(masterRelayList);
    const [relayGroup, setRelayGroup] = useAtom(selectedRelayGroup);
    const [inputValue, setInputValue] = React.useState("");
    const hasItems =
        Object.keys(relayObj.relay_url_list[relayGroup].urls).length > 0;

    const removeRelay = (tmp_relay_url) => {
        console.log("WE_SHOULD_REMOVE_THAT_RELAY_NOW");
        console.log(tmp_relay_url);
        // setRealyObj({ page: "New Account Verify Published Profile" });
        setRealyObj((prevItems) => ({
            ...prevItems,
            relay_url_list: {
                ...prevItems.relay_url_list,
                [relayGroup]: {
                    ...prevItems.relay_url_list[relayGroup],
                    urls: prevItems.relay_url_list[relayGroup].urls.filter(
                        (urls) => urls !== tmp_relay_url,
                    ),
                },
            },
        }));
    };
    const addRelay = () => {
        if (!relayObj.relay_url_list[relayGroup].urls.includes(inputValue)) {
            setRealyObj((prevItems) => ({
                ...prevItems,
                relay_url_list: {
                    ...prevItems.relays,
                    [relayGroup]: {
                        ...prevItems.relay_url_list[relayGroup],
                        urls: [
                            ...prevItems.relay_url_list[relayGroup].urls,
                            inputValue,
                        ],
                    },
                },
            }));
        }
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };
    React.useEffect(() => {
        setRelayGroup("testing")
    }, []);

    return (
        <>
            {hasItems
                ? (
                    <>
                        {Object.entries(
                            relayObj.relay_url_list[relayGroup].urls,
                        ).map(([key, value]) => (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "10px 16px",
                                    borderBottom: "1px solid #e0e0e0",
                                    width: "100%",
                                    maxWidth: 400,
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{ fontWeight: "medium" }}
                                >
                                    {relayObj.relay_url_list[relayGroup]
                                        .urls[key]}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    sx={{ textTransform: "none" }}
                                    onClick={() =>
                                        removeRelay(
                                            relayObj.relay_url_list[relayGroup]
                                                .urls[key],
                                        )}
                                >
                                    Remove
                                </Button>
                            </Box>
                        ))}
                    </>
                )
                : <p>The object is empty.</p>}
            <TextField
                label="Enter Relay URL"
                variant="outlined"
                value={inputValue}
                onChange={handleInputChange}
                fullWidth
                helperText="Enter a relay URL you would like to add"
            />
            <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ textTransform: "none" }}
                onClick={addRelay}
            >
                Add Relay
            </Button>
        </>
    );
}
