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
import { useNavigate } from 'react-router-dom';

const raw_markdown = `A paragraph with *emphasis* and **strong importance**.

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
    const navigate = useNavigate();
    const [ndoc, setNDoc] = React.useState({});
    const [theFilter, setTheFilter] = React.useState({});
    const [directoryData, setDirectoryData] = React.useState({});
    const [docAddr, setDocAddr] = React.useState({});
    const [docEvent, setDocEvent] = React.useState({});
    const [markdown, setMarkdown] = React.useState(raw_markdown);

    const replaceNaddrLinks = (text) => {
        try {
            const regex = /\[([^\]]*)\]\(nostr([^)]*)\)/g;

            // Step 1: Select and log all links
            const matches = [...text.matchAll(regex)];
            console.log("Found links:");
            let naddr = "";
            let title = "";
            matches.forEach((match, index) => {
                console.log(`Link ${index + 1}:`);
                console.log(`Full match: ${match[0]}`); // e.g., [Google](https://google.com)
                console.log(`Title: ${match[1]}`); // e.g., Google
                console.log(`Link: ${match[2]}`); // e.g., https://google.com
                title = match[1];
                naddr = match[2];
            });
            if (naddr != "") {
                const replaceRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
                // Step 2: Replace links with HTML
                text = text.replace(
                    replaceRegex,
                    `[${title}](/ndoc/${naddr.split(":")[1]})`,
                );
            }
            return text;
        } catch (error) {
            return text;
        }
    };
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
        if (selectedNode == null) {
            return null
        }
        if (selectedNode) {
            console.log(`Selected item label: ${selectedNode.label}`);
            console.log(selectedNode);
            navigate(`/ndoc/${selectedNode.naddr}`);
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
                    authors: [decoded_data.data.pubkey],
                };
                for await (
                    const msg of my_pool.req([the_filter], {
                        relays: decoded_data.data.relays,
                    })
                ) {
                    if (msg[0] === "EVENT") {
                        setDocEvent(msg[2]);
                        setMarkdown(replaceNaddrLinks(msg[2].content));
                    }
                    if (msg[0] === "EOSE") break;
                }
            } catch (error) {
                console.log("handleItemSelection error");
                console.log(error);
            }
        }
    };
    async function fetchDirectory(ndocData) {
        let the_filter = {
            kinds: [39761],
            "#ds": ndocData.data.identifier.split(":")[0],
            "limit": 1,
        };
        console.log("fetchDirectory filter");
        console.log(the_filter);
        for await (
            const msg of my_pool.req([the_filter], {
                relays: ndocData.data.relays,
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
                if (Object.keys(docAddr).length == 0) {
                    for (const tag of msg[2].tags) {
                        if (tag[0] == "ds") {
                            handleItemSelection("TEST", tag[1]);
                        }
                    }
                }
            }
            if (msg[0] === "EOSE") break;
        }
    }

    async function fetchDocument(ndocData) {
        let the_filter = {
            kinds: [ndocData.data.kind],
            "#ds": ndocData.data.identifier.split(":")[0],
            "limit": 1,
        };
        for await (
            const msg of my_pool.req([the_filter], {
                relays: ndocData.data.relays,
            })
        ) {
            if (msg[0] === "EVENT") {
                setDocEvent(msg[2]);
                setMarkdown(replaceNaddrLinks(msg[2].content));
            }
            if (msg[0] === "EOSE") break;
        }
    }
    React.useEffect(() => {
        try {
            let ndocData = nip19.decode(params.naddr);
            ndocData.doc_space_id = ndocData.data.identifier.split(":")[0];
            ndocData.doc_id = ndocData.data.identifier.split(":")[1];
            console.log("ndocData");
            console.log(ndocData);
            setNDoc(ndocData);
            let theRelays = ndocData.data.relays;
            console.log("THIS_FILTER");
            console.log(theFilter);
            console.log(theRelays);
            setDocAddr(ndocData);
            fetchDocument(ndocData);
            fetchDirectory(ndocData);
        } catch (error) {
            console.log("INVALID naddr");
            console.log(error);
        }
    }, []);
    return (
        <>
            <h1>Nostr Document Spaces POC</h1>
            <br></br>
            <br></br>
            {"directory" in directoryData && (
                <>
                    <h1>Directory</h1>
                    <RichTreeView
                        items={[directoryData.directory]}
                        onItemSelectionToggle={handleItemSelection}
                        defaultExpandedItems={["root"]}
                        sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                    />
                </>
            )}
            <Markdown >{markdown}</Markdown>

            {/* <br></br>
            <br></br>
            <br></br>
            <br></br>
            <h1>Raw Content as Markdown</h1>
            {"content" in docEvent && <Markdown>{docEvent.content}</Markdown>}
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <pre>{JSON.stringify(ndoc, null, 2)}</pre>
            <pre
                style={{
                    width: "100%",
                    boxSizing: "border-box",
                    margin: 0,
                    padding: "10px",
                    whiteSpace: "pre-wrap", // Enables word wrapping
                    overflowX: "auto", // Handles horizontal overflow for long content
                }}
            >Doc Event\n{JSON.stringify(docEvent, null, 2)}</pre>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <pre
                style={{
                    width: "100%",
                    boxSizing: "border-box",
                    margin: 0,
                    padding: "10px",
                    whiteSpace: "pre-wrap", // Enables word wrapping
                    overflowX: "auto", // Handles horizontal overflow for long content
                }}
            >{JSON.stringify(docAddr, null, 2)}</pre> */}

        </>
    );
}
