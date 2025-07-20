import { useAtom } from "jotai";
import { accountsAtom, selectedAccountAtom, appPageAtom } from "~/jotaiAtoms";

import React from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
import NostrAccountData from "~/components/NostrAccountData";

export function LoginViaExtension() {
    const [accounts, setAccounts] = useAtom(accountsAtom);
    const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
    const [appPage, setAppPage] = useAtom(appPageAtom);

    const prevousPage = () => {
        setAppPage({ page: "New Account Keys" });
    };
    const nextPage = () => {
        setAppPage({ page: "New Account Verify Published Profile" });
    }

    React.useEffect(() => {
        async function getExtensionData() {
            let pubkey = await window.nostr.getPublicKey()
            console.log("WE_GOT_A_PUBKEY")
            console.log(pubkey)
            let accountsData =
            {
                type: "nip-07",
                mnemonic: "Check NIP-07 Extension",
                nsec: "Check NIP-07 Extension",
                npub: nip19.npubEncode(pubkey),
                privkey: "Check NIP-07 Extension",
                pubkey: pubkey,
            }
            setAccounts((prevItems) => ({
                ...prevItems,
                [accountsData.pubkey]: accountsData
            }))
            setSelectedAccount(accountsData.pubkey)
        }
        getExtensionData()
    }, [])
    return (
        <>
            <Typography
                variant="body3"
                style={{ textAlign: "left", display: "flex" }}
            >
                This is Your Extension's Pubkey Data<br></br>
            </Typography>
            <NostrAccountData
                mnemonic={accounts[selectedAccount].mnemonic}
                pubkey={accounts[selectedAccount].pubkey}
                privkey={accounts[selectedAccount].privkey}
                npub={accounts[selectedAccount].npub}
                nsec={accounts[selectedAccount].nsec}
            ></NostrAccountData>
            <Button variant="contained" onClick={prevousPage}>
                Previouis: New Account Keys
            </Button>
            <Button variant="contained" onClick={nextPage}>
                Next: Verify Published Profile
            </Button>

        </>

    );
}
