import React from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAtom } from "jotai";
import {
    accountsAtom,
    appPageAtom,
    editProfileEventId,
    EditProfileJson,
    masterRelayList,
    profileEvents,
    relayWebSocketsAtom,
    selectedAccountAtom,
    selectedRelayGroup
} from "~/jotaiAtoms";
import { faker } from "@faker-js/faker";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { EditRelayList } from "~/components/EditRealyList";
import EditNostrProfile from "~/components/EditNostrProfile";
import { JsonEditor } from "json-edit-react";
import NostrAccountData from "~/components/NostrAccountData";
import {
    generateSeedWords,
    privateKeyFromSeedWords,
    validateWords,
} from "nostr-tools/nip06";
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
import { DEFAULT_TESTING_RELAYS } from "~/relays";
import { NSecSigner } from "@nostrify/nostrify";
import { my_pool } from "~/relays";
import { bytesToHex } from "nostr-tools/utils";
import { Box } from "@mui/material";

export function PublishTestProfile() {
    const [editEventId, setEventId] = useAtom(editProfileEventId)
    const [profiles, setProfiles] = useAtom(profileEvents)
    const [accounts, setAccounts] = useAtom(accountsAtom)
    const [relayObj, setRealyObj] = useAtom(masterRelayList)
    const [relayWebSockets, setRelayWebSockets] = useAtom(relayWebSocketsAtom)
    const [appPage, setAppPage] = useAtom(appPageAtom)
    const [profileJsonData, setProfileJsonData] = useAtom(EditProfileJson)
    const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom)
    const [relayGroup, setRelayGroup] = useAtom(selectedRelayGroup);
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

    React.useEffect(() => {
        console.log("CHECKING_FOR_ACCOUNTS");
        if (Object.keys(accounts).length == 0) {
            console.log("GENERATING_ACCOUNT");
            const mnemonic = generateSeedWords();
            const secretKey = privateKeyFromSeedWords(mnemonic, "", 0);
            const pubkey = getPublicKey(secretKey);
            const npub = nip19.nsecEncode(secretKey);
            const nsec = nip19.npubEncode(pubkey);
            const privkey = bytesToHex(secretKey);
            const account_data = {
                type: "mnemonic",
                mnemonic: mnemonic,
                nsec: nsec,
                npub: npub,
                privkey: privkey,
                pubkey: pubkey,
            };
            console.log("SETTING_THE_ACCOUNTS");
            setSelectedAccount(pubkey);
            setAccounts((prevItems) => ({
                ...prevItems, // Spread existing items
                [pubkey]: account_data,
            }));
            console.log("SHOULD_HAVE_SET_THE_ACCOUNTS");
        }
        // Set the Relays

        // setSelectedRelays(DEFAULT_TESTING_RELAYS);
        my_pool.group(relayObj.relay_url_list[relayGroup].urls);

        // Set the test account
        const username = faker.internet.username();
        let picture = faker.image.avatar();
        let discription = faker.food.description();
        const bannerUrl = faker.image.url();

        let website = faker.internet.url();
        let profile = {
            "name": username,
            "display_name": username,
            "nip05": `${username}.TLD`,
            "about": `THIS IS A TEST ACCOUNTn\ ${discription}`,
            "picture": picture,
            "banner": bannerUrl,
            "website": website,
        };
        console.log("WE_GOT_THE_PROFILE");
        console.log(profile);
        setProfiles({ "NewTestAccount": { "JsonContent": profile } });
        setEventId("NewTestAccount");
        setProfileJsonData(profile);
        let tmp_relays: any = {};
        for (const relay of DEFAULT_TESTING_RELAYS) {
            tmp_relays[relay] = "enabled";
        }
    }, []);

    const publishProfile = async () => {
        let nip65_tags = [];
        for (const relay of relayObj.relay_url_list[relayGroup].urls) {
            nip65_tags.push(["r", relay]);
        }
        let unix_time = Math.floor((new Date()).getTime() / 1000);
        let signer = undefined
        if(accounts[selectedAccount].type == "nip-07") {
            signer = window.nostr
        } else {
            signer = new NSecSigner(accounts[selectedAccount].privkey)
        }
        const profileEvent = await signer.signEvent({
            kind: 0,
            content: JSON.stringify(profileJsonData),
            tags: [],
            created_at: unix_time,
        });
        let nip65Event = await signer.signEvent({
            kind: 10002,
            content: "",
            tags: nip65_tags,
            created_at: unix_time,
        });
        console.log("Here are our events");
        console.log(profileEvent);
        console.log(nip65Event);
        my_pool.event(profileEvent, { relays: DEFAULT_TESTING_RELAYS });
        my_pool.event(nip65Event, { relays: DEFAULT_TESTING_RELAYS });
    }

    const nextPage = () => {
        setAppPage({ page: "New Account Verify Published Profile" });
    }
    const [tmpAccount, setTmpAccount] = React.useState({
        mnemonic: "PLACEHOLDER",
        nsec: "PLACEHOLDER",
        npub: "PLACEHOLDER",
        privkey: "PLACEHOLDER",
        pubkey: "PLACEHOLDER",
        secretKey: "PLACEHOLDER"
    })
    const addAccount = () => {
        if (selectedAccount != undefined && selectedAccount.length != 0) {
            setTmpAccount(accounts[selectedAccount])
        } else {
            let mnemonic = generateSeedWords()
            let secretKey = privateKeyFromSeedWords(mnemonic, "", 0)
            let nsec = nip19.nsecEncode(secretKey)
            let publicKey = getPublicKey(secretKey)
            let npub = nip19.npubEncode(publicKey)
            let pubkey = getPublicKey(nip19.decode(nsec).data)
            let account_data = {
                mnemonic: mnemonic,
                nsec: nsec,
                npub: npub,
                privkey: bytesToHex(nip19.decode(nsec).data),
                pubkey: getPublicKey(nip19.decode(nsec).data),
                secretKey: secretKey
            }
            setTmpAccount(account_data)
            setAccounts((prevState) => ({
                ...prevState, // Spread the previous state to keep other keys
                [pubkey]: account_data,
            }))
            setSelectedAccount(pubkey)
            let profileData: any = {}
            profileData[pubkey] = { "json_content": {} }
            setProfiles(profileData)
            setEventId(pubkey)
        }
    };
    React.useEffect(() => {
        addAccount()
    }, [])
    return (
        <>
            <Typography
                variant="h3"
                style={{ textAlign: "left", display: "flex" }}
            >
                Your Test Nostr Account Keys<br></br>
            </Typography>
            <Box>
                <NostrAccountData
                    mnemonic={tmpAccount.mnemonic}
                    pubkey={tmpAccount.pubkey}
                    privkey={tmpAccount.privkey}
                    npub={tmpAccount.npub}
                    nsec={tmpAccount.nsec}
                ></NostrAccountData>
            </Box>
            <Typography
                variant="h3"
                style={{ textAlign: "left", display: "flex" }}
            >
                Your Selected Relays for Testing<br></br>
            </Typography>
            <Box>
                {/*
                    We need to be able to add and remove relays from the list
                    And reset to Default if we want
                */}
                {/* <SyntaxHighlighter language="json" style={docco}>
                    {JSON.stringify(relayObj.relay_url_list["testing"].urls, null, 2)}
                </SyntaxHighlighter> */}
                <EditRelayList></EditRelayList>
            </Box>
            <Typography
                variant="h3"
                style={{ textAlign: "left", display: "flex" }}
            >
                Edit Your Test Profile Info<br></br>
            </Typography>
            <Box>
                <JsonEditor
                    data={profileJsonData}
                    setData={setProfileJsonData}
                />
            </Box>
            <Button variant="contained" onClick={publishProfile}>
                Publish Your Profile
            </Button>
            <Button variant="contained" onClick={nextPage}>
                Verify Published Profile
            </Button>
        </>
    );
}
