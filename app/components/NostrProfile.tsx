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

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';


import { JsonEditor } from 'json-edit-react'

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
  function rebroadcastProfile() {
    setAppPage({ page: "Rebroadcast Profile" });
    setEditPubkey(props.profile.id);
  }
  return (
    <>
      <Card sx={{ width: "80%", margin: "50px" }}>
        <SyntaxHighlighter language="json" style={docco}>
          {JSON.stringify(props.profile, null, 2)}
        </SyntaxHighlighter>
        <CardActions>
          <Button
            size="small"
            onClick={rebroadcastProfile}>
            Rebroadcast This Profile
          </Button>
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
    </>
  );
}
