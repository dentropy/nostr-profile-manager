import { useAtom } from "jotai";
import { profileEvents } from "~/jotaiAtoms";
import NostrProfile from "../components/NostrProfile";
export default function NostrProfiles() {
  const [profileData, setProfileData] = useAtom(profileEvents);
  const hasItems = Object.keys(profileData).length > 0;
  return (
    <>
      {hasItems ? (
        <>
          {Object.entries(profileData).map(([key, value]) => (
            <NostrProfile profile={profileData[key].ui_data} />
          ))}
        </>
      ) : (
        <p>The object is empty.</p>
      )}
    </>
  );
}
