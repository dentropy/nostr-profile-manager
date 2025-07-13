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
    masterRelayList
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
export function PublishTestProfile() {
    const [editEventId, setEventId] = useAtom(editProfileEventId);
    const [profiles, setProfiles] = useAtom(profileEvents);
    const [accounts, setAccounts] = useAtom(accountsAtom);
    const [selectedRelays, setSelectedRelays] = useAtom(selectedRelayListAtom);
    const [relayWebSockets, setRelayWebSockets] = useAtom(relayWebSocketsAtom);
    const [nip33Data, setNIP33Data] = useAtom(NIP33Data);
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const [profileJsonData, setProfileJsonData] = useAtom(EditProfileJson);

    const [theRelayList, setTheRelayList] = useAtom(masterRelayList);
    // const [mnemonic, setMnemonic] = React.useState(generateSeedWords());
    // const [secretKey, setSecretKey] = React.useState(
    //     privateKeyFromSeedWords(mnemonic, "", 0),
    // );
    // const [publicKey, setPublicKey] = React.useState(getPublicKey(secretKey));
    // const [nsec, setNsec] = React.useState(nip19.nsecEncode(secretKey));
    // const [npub, setNpub] = React.useState(nip19.npubEncode(publicKey));

    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

    React.useEffect(() => {
        if (!Object.keys(accounts).includes("testing")) {
            const mnemonic = generateSeedWords();
            const secretKey = privateKeyFromSeedWords(mnemonic, "", 0);
            const publicKey = getPublicKey(secretKey);
            const npub = nip19.nsecEncode(secretKey);
            const nsec = nip19.npubEncode(publicKey);
            setAccounts((prevItems) => ({
                ...prevItems, // Spread existing items
                "testing": {
                    mnemonic: mnemonic,
                    nsec: nsec,
                    npub: npub,
                    privkey: nsec,
                    pubkey: publicKey,
                }, // Add new item with unique key
            }));
        }
        // Set the Relays
        setSelectedRelays(DEFAULT_TESTING_RELAYS);
        my_pool.group(DEFAULT_TESTING_RELAYS);

        // // Set the Accounts from Memory
        // setAccounts([
        //     {
        //         nsec,
        //         npub: nip19.npubEncode(getPublicKey(nip19.decode(nsec).data)),
        //         privkey: nip19.decode(nsec).data,
        //         pubkey: getPublicKey(nip19.decode(nsec).data),
        //     },
        // ]);

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
        console.log("PAUL_WAS_HERE")
        console.log(accounts)
        console.log(accounts["testing"])
        console.log(accounts["testing"].mnemonic)
        let secret_key = privateKeyFromSeedWords(accounts["testing"].mnemonic, "", 0);
        const signer = new NSecSigner(secret_key);
        const event = await signer.signEvent({
            kind: 0,
            content: "Hello, world!",
            tags: [],
            created_at: 0,
        });
        console.log("THE_EVENT");
        console.log(event);
        console.log("THE_RELAYS")
        console.log(theRelayList.relays.testing)
        my_pool.event(event, { relays: theRelayList.relays.testing });
        console.log("SHOUD_HAVE_PUBLISHED");
    };

    const nextPage = () => {
        setAppPage({ page: "New Account Verify Published Profile" });
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
                Edit Your Profile Info<br></br>
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
