import React, { useEffect, useRef } from "react";
import {
    finalizeEvent,
    generateSecretKey,
    getPublicKey,
    nip19,
    verifyEvent,
} from "nostr-tools";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
    useParams,
} from "react-router-dom";
import { my_pool } from "~/relays";
import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";

export default function About() {
    const params = useParams();
    const [ndoc, setNDoc] = React.useState({});
    const [theFilter, setTheFilter] = React.useState({});
    const [directoryData, setDirectoryData] = React.useState({});

    // Helper function to find node by ID
    const findNodeById = (node, id) => {
        if (node.id === id) return node;
        for (const child of node.children) {
            const found = findNodeById(child, id);
            if (found) return found;
        }
        return null;
    };

    // Function to handle item selection
    const handleItemSelection = (event, itemId) => {
        const selectedNode = findNodeById(directoryData, itemId);
        if (selectedNode) {
            console.log(`Selected item label: ${selectedNode.label}`);
            // Trigger your custom function here with selectedNode.label as input
            // yourCustomFunction(selectedNode.label);
        }
    };
    async function fetchDirectory(the_filter, the_relays) {
        console.log("fetchDirectory");
        for await (
            const msg of my_pool.req([the_filter], {
                relays: the_relays,
            })
        ) {
            console.log(msg);
            if (msg[0] === "EVENT") {
                console.log("FOUND_A_EVENT");
                console.log(msg[2]);
                setDirectoryData((prevItems) => ({
                    ...prevItems,
                    directory: JSON.parse(msg[2].content),
                }));
                console.log(JSON.parse(msg[2].content))
            }
            if (msg[0] === "EOSE") break;
        }
    }
    console.log(params);
    console.log("params");
    React.useEffect(() => {
        try {
            let ndocData = nip19.decode(params.naddr);
            console.log("ndocData");
            console.log(ndocData);
            // setNDoc(ndocData);
            let theFilter = {
                kind: ndocData.data.kind,
                "#ds": ndocData.data.identifier,
                "limit": 1,
            };
            let theRelays = ndocData.data.relays;
            console.log(theFilter);
            console.log(theRelays);
            fetchDirectory(theFilter, theRelays);
        } catch (error) {
            console.log("INVALID naddr");
        }
    }, []);
    return (
        <>
            <h1>HELLO</h1>
            <br></br>
            <pre>{JSON.stringify(ndoc, null, 2)}</pre>
            <br></br>
            {"directory" in directoryData && (
                <>
                    <h1>WE_FOUND_THE_EVENT</h1>
                    <RichTreeView
                        items={[directoryData.directory]}
                        onItemSelectionToggle={handleItemSelection}
                        defaultExpandedItems={["root"]}
                        sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                    />
                </>
            )}
        </>
    );
}
