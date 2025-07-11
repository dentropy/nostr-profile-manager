import { useAtom } from "jotai";
import { appPageAtom } from "~/jotaiAtoms";

import EditNostrProfile from "~/components/EditNostrProfile";
import { Button } from "@mui/material";
import NostrProfile from "~/components/NostrProfile";
export default function FetchingProfilePage() {
    const [appPage, setAppPage] = useAtom(appPageAtom);
    const prevousPage = () => {
        setAppPage({ page: "New Account Keys" });
    };
    const nextPage = () => {
        setAppPage({ page: "New Account Relays" });
    };
    return (
        <>
            <h1>Let's look around for your profile</h1>
            <NostrProfile></NostrProfile>
            <Button variant="contained" onClick={prevousPage}>
                Previouis: New Account Keys
            </Button>
            <Button variant="contained" onClick={nextPage}>
                Next: Relays
            </Button>
        </>
    );
}
