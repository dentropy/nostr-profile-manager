import { useAtom } from "jotai";
import { appPageAtom } from "~/jotaiAtoms";

import EditNostrProfile from "~/components/EditNostrProfile";
import { Button } from "@mui/material";
import { RelayPage } from "./RelayPage";
export default function NewAccountRelays() {
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const prevousPage = () => {
        setAppPage({ page: "New Account Profile" });
    };
    const nextPage = () => {
        setAppPage({ page: "New Account Publish Profile" });
    };
    return (
        <>
            <h1>Select the Relay You want to Publish To</h1>
            <RelayPage></RelayPage>
            <Button variant="contained" onClick={prevousPage}>
                Previouis: New Account Profile
            </Button>
            <Button variant="contained" onClick={nextPage}>
                Next: New Account Publish Profile
            </Button>
        </>
    );
}
