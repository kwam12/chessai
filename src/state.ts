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
