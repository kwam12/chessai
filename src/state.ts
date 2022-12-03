import { atom } from "recoil";
import { PossibleGameLevel } from "./aiMove";
import { Key } from "./chessground-primitives";

export const fenAtom = atom<string>({
  key: "fenAtom",
  default: "",
});

export const destsAtom = atom<Map<Key, Key[]>>({
  key: "destsAtom",
  default: new Map(),
});

export const checkAtom = atom<boolean>({
  key: "checkAtom",
  default: false,
});

export const levelAtom = atom<PossibleGameLevel>({
  key: "levelAtom",
  default: 1,
});
