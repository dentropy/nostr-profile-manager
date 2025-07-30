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
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`;

export default function About() {
    const params = useParams();
    const [ndoc, setNDoc] = React.useState({});
    const [theFilter, setTheFilter] = React.useState({});
    const [directoryData, setDirectoryData] = React.useState({});
    const [docAddr, setDocAddr] = React.useState({});
    const [docEvent, setDocEvent] = React.useState({});

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
    const handleItemSelection = async (event, itemId) => {
        console.log("handleItemSelection");
        console.log(itemId);
        console.log(directoryData);
        const selectedNode = findNodeById(directoryData.directory, itemId);
        if (selectedNode) {
            console.log(`Selected item label: ${selectedNode.label}`);
            console.log(selectedNode);
            try {
                let decoded_data = nip19.decode(selectedNode.naddr);
                decoded_data.doc_space_id =
                    decoded_data.data.identifier.split(":")[0];
                decoded_data.doc_id =
                    decoded_data.data.identifier.split(":")[1];
                setDocAddr(decoded_data);
                // We gotta grab the data event and store it via useState
                let the_filter = {
                    // kinds: [decoded_data.data.kind],
                    "#d": decoded_data.doc_id,
                    "#ds": decoded_data.doc_space_id,
                    authors: [decoded_data.data.pubkey]
                };
                for await (
                    const msg of my_pool.req([the_filter], {
                        relays: decoded_data.data.relays,
                    })
                ) {
                    if (msg[0] === "EVENT") {
                        console.log("SHOULD_SET_DOC_EVENT")
                        setDocEvent(msg[2]);
                    }
                    if (msg[0] === "EOSE") break;
                }
            } catch (error) {
                console.log("handleItemSelection error")
                console.log(error)
            }
        }
    };
    async function fetchDirectory(the_filter, the_relays) {
        console.log("fetchDirectory");
        console.log(the_filter)
        for await (
            const msg of my_pool.req([the_filter], {
                relays: the_relays,
            })
        ) {
            console.log(msg);
            if (msg[0] === "EVENT") {
                console.log("FOUND_A_EVENT_for_fetchDirectory");
                console.log(msg[2]);
                setDirectoryData((prevItems) => ({
                    ...prevItems,
                    directory: JSON.parse(msg[2].content),
                }));
                console.log(JSON.parse(msg[2].content));
                if( Object.keys(docAddr).length == 0) {
                    for(const tag of msg[2].tags) {
                        if(tag[0] == "ds") {
                            handleItemSelection("TEST", tag[1])
                        }
                    }
                }
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
                kinds: [ndocData.data.kind],
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
            <pre
                style={{
                    width: "100%",
                    boxSizing: "border-box",
                    margin: 0,
                    padding: "10px",
                    whiteSpace: 'pre-wrap', // Enables word wrapping
                    overflowX: "auto", // Handles horizontal overflow for long content
                }}
            >{JSON.stringify(docAddr, null, 2)}</pre>
            <pre
                style={{
                    width: "100%",
                    boxSizing: "border-box",
                    margin: 0,
                    padding: "10px",
                    whiteSpace: 'pre-wrap', // Enables word wrapping
                    overflowX: "auto", // Handles horizontal overflow for long content
                }}
            >Doc Event\n{JSON.stringify(docEvent, null, 2)}</pre>
            {"content" in docEvent && <Markdown>{docEvent.content}</Markdown>}
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
        </>
    );
}
