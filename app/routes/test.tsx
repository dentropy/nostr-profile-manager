import { Welcome } from "../index";
import type { Route } from "./+types/index";

import UserProfileCard from "~/testComponents/userProfileCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const sampleUser = {
    name: 'Alex Johnson',
    bio: 'Full-stack developer with a passion for open-source projects and machine learning.',
    avatar: 'https://via.placeholder.com/150/1976d2/ffffff?text=AJ',
    stats: {
      followers: 350,
      following: 120,
      posts: 89,
    },
  };

  import { CssBaseline, Container } from '@mui/material';
export default function About() {
    <>
      <h1>HELLO</h1>
    </>
}
