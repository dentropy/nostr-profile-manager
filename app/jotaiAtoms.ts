import { atom } from "jotai";

export const accountsAtom = atom([]);

export const appPageAtom = atom({ page: "Add Account" });

export const profileEvents = atom({});
export const editProfileEventId = atom(undefined);

export const wsPublish = new WebSocket("wss://archive.mememaps.net")