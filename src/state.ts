import { User } from "@supabase/supabase-js";
import { atom } from "recoil";
import { PossibleGameLevel } from "./aiMove";
import { Key } from "./chessground-primitives";

export const fenAtom = atom<string>({
  key: "fenAtom",
  default: "",
});

export const destsAtom = atom<Map<Key, Key[]> | null>({
  key: "destsAtom",
  default: null,
});

export const checkAtom = atom<boolean>({
  key: "checkAtom",
  default: false,
});

export const levelAtom = atom<PossibleGameLevel>({
  key: "levelAtom",
  default: 1,
});

export const playingAtom = atom<"online" | "ai" | "searching">({
  key: "playingAtom",
  default: "ai",
});

export const playingAsAtom = atom<"white" | "black">({
  key: "playingAsAtom",
  default: "white",
});

export const userAtom = atom<User | null>({
  key: "userAtom",
  default: null,
});

export const otherUserAtom = atom<User | null>({
  key: "otherUserAtom",
  default: null,
});
