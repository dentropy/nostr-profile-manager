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
    NIP33Data,
    profileEvents,
    relayWebSocketsAtom,
    selectedRelayListAtom,
    masterRelayList,
    selectedAccountAtom
} from "~/jotaiAtoms";
import { faker } from "@faker-js/faker";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

import EditNostrProfile from "~/components/EditNostrProfile";
import { JsonEditor } from "json-edit-react";

import {
    generateSeedWords,
    privateKeyFromSeedWords,
    validateWords,
} from "nostr-tools/nip06";
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
// import { rxReq } from "~/pages/index"
// import { verifier } from "@rx-nostr/crypto";
// import { createRxForwardReq, createRxNostr } from "rx-nostr";
// export const rxNostr = createRxNostr({ verifier });

import { DEFAULT_TESTING_RELAYS } from "~/relays";

import { ToggleRelayList } from "~/components/selectRelays";
import { NSecSigner } from "@nostrify/nostrify";

import { my_pool } from "~/relays";
import { bytesToHex } from "nostr-tools/utils";
export function PublishTestProfile() {
    const [editEventId, setEventId] = useAtom(editProfileEventId);
    const [profiles, setProfiles] = useAtom(profileEvents);
    const [accounts, setAccounts] = useAtom(accountsAtom);
    const [selectedRelays, setSelectedRelays] = useAtom(selectedRelayListAtom);
    const [relayWebSockets, setRelayWebSockets] = useAtom(relayWebSocketsAtom);
    const [nip33Data, setNIP33Data] = useAtom(NIP33Data);
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const [profileJsonData, setProfileJsonData] = useAtom(EditProfileJson);
    const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
    const [theRelayList, setTheRelayList] = useAtom(masterRelayList);

    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

    React.useEffect(() => {
        console.log("CHECKING_FOR_ACCOUNTS")
        if (Object.keys(accounts).length == 0) {
            console.log("GENERATING_ACCOUNT")
            const mnemonic = generateSeedWords();
            const secretKey = privateKeyFromSeedWords(mnemonic, "", 0);
            const pubkey = getPublicKey(secretKey);
            const npub = nip19.nsecEncode(secretKey);
            const nsec = nip19.npubEncode(pubkey);
            const privkey = bytesToHex(secretKey)
            const account_data = {
                mnemonic: mnemonic,
                nsec: nsec,
                npub: npub,
                privkey: privkey,
                pubkey: pubkey,
            }
            console.log("SETTING_THE_ACCOUNTS")
            setSelectedAccount(pubkey)
            setAccounts((prevItems) => ({
                ...prevItems, // Spread existing items
                [pubkey]: account_data,
            }));
            console.log("SHOULD_HAVE_SET_THE_ACCOUNTS")

        }
        // Set the Relays
        setSelectedRelays(DEFAULT_TESTING_RELAYS);
        my_pool.group(DEFAULT_TESTING_RELAYS);

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
        for (const relay of selectedRelays) {
            nip65_tags.push(["r", relay]);
        }
        let unix_time = Math.floor((new Date()).getTime() / 1000);
        const signer = new NSecSigner(accounts[selectedAccount].privkey);
        const profileEvent = await signer.signEvent({ 
            kind: 0, 
            content: JSON.stringify(profileJsonData),
            tags: [],
            created_at: unix_time 
        })
        let nip65Event = await signer.signEvent({ 
            kind: 10002,
            content: "",
            tags: nip65_tags,
            created_at: unix_time
        });
        console.log("Here are our events")
        console.log(profileEvent);
        console.log(nip65Event);
        my_pool.event(profileEvent, {relays: DEFAULT_TESTING_RELAYS})
        my_pool.event(nip65Event, {relays: DEFAULT_TESTING_RELAYS})
    };

    const nextPage = () => {
        setAppPage({ page: "New Account Verify Published Profile" })
    };

    return (
        <>
            <Typography
                variant="body3"
                style={{ textAlign: "left", display: "flex" }}
            >
                Your Selected Relays<br></br>
            </Typography>
            <SyntaxHighlighter language="json" style={docco}>
                {JSON.stringify(DEFAULT_TESTING_RELAYS, null, 2)}
            </SyntaxHighlighter>

            <Typography
                variant="body3"
                style={{ textAlign: "left", display: "flex" }}
            >
                Edit Your Test Profile Info<br></br>
            </Typography>
            <JsonEditor
                data={profileJsonData}
                setData={setProfileJsonData}
            />

            <Button variant="contained" onClick={publishProfile}>
                Publish Your Profile
            </Button>
            <Button variant="contained" onClick={nextPage}>
                Verify Published Profile
            </Button>
        </>
    );
}
