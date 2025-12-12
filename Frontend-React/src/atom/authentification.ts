import { atom } from "jotai";
import type { User } from "../interfaces/authentification";

export const authentificationAtom = atom<User>()