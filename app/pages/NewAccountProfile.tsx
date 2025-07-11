import { useAtom } from "jotai";
import { appPageAtom } from "~/jotaiAtoms";

import EditNostrProfile from "~/components/EditNostrProfile";
import { Button } from "@mui/material";

export default function NewAccountProfile() {
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const prevousPage = () => {
        setAppPage({ page: "New Account Keys" });
    };
    const nextPage = () => {
        setAppPage({ page: "New Account Relays" });
    };
    return (
        <>
            <h1>Copy and save this somewhere or your will lose your account</h1>
            <EditNostrProfile></EditNostrProfile>
            <Button variant="contained" onClick={prevousPage}>
                Previouis: New Account Keys
            </Button>
            <Button variant="contained" onClick={nextPage}>
                Next: Relays
            </Button>
        </>
    );
}
