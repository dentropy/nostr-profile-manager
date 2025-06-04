import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { useAtom } from "jotai";
import { editProfileEventId } from "~/jotaiAtoms";
import { appPageAtom } from "~/jotaiAtoms";

const special_keys = [
  "nip05",
  "name",
  "picture",
  "displayName",
  "about",
  "website",
  "banner",
];
export default function NostrProfile(props: any) {
  console.log("HERE IS THE PROFILE");
  console.log(props);

  const [appPage, setAppPage] = useAtom(appPageAtom);
  const [editPubkey, setEditPubkey] = useAtom(editProfileEventId);
  function editProfile() {
    setAppPage({ page: "Edit Profile" });
    setEditPubkey(props.profile.id);
  }
  return (
    <Card sx={{ width: "80%", margin: "50px", justifyContent: "center" }}>
      <CardContent>
        <Typography variant="body1">
          pubkey: <br />
          {props.profile.pubkey}
        </Typography>
        <br />
        <Typography variant="body1">
          from: {JSON.stringify(props.profile.from)}
        </Typography>
        <br />
        <Typography variant="body1">
          name:{" "}
          {"name" in props.profile.json_content
            ? props.profile.json_content.name
            : "Not provided"}
        </Typography>
        <br />
        <Typography variant="body1">
          displayName:{" "}
          {"displayName" in props.profile.json_content
            ? props.profile.json_content.displayName
            : "Not provided"}
        </Typography>
        <br />
        <Typography variant="body1">
          picture: <br />
          {"picture" in props.profile.json_content
            ? props.profile.json_content.picture
            : "Not provided"}
        </Typography>
        <br />
        <Typography variant="body1">
          banner: <br />
          {"banner" in props.profile.json_content
            ? props.profile.json_content.banner
            : "Not provided"}
        </Typography>
        <br />
        <Typography variant="body1">
          about: <br />
          {"about" in props.profile.json_content
            ? props.profile.json_content.about
            : "Not provided"}
        </Typography>
        <br />
        <Typography variant="body1">
          website: <br />
          {"website" in props.profile.json_content
            ? props.profile.json_content.website
            : "Not provided"}
        </Typography>
        <br />
        <p>TODO display all special key value pairs</p>
      </CardContent>
      <CardActions>
        <Button size="small">Rebroadcast Everywhere</Button>
      </CardActions>
      <CardActions>
        <Button size="small">Rebroadcast To Specific Relays</Button>
      </CardActions>
      <CardActions>
        <Button
          size="small"
          onClick={editProfile}
        >
          Edit Profile
        </Button>
      </CardActions>
    </Card>
  );
}
