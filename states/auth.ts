import { userLoggedInData, adminLoggedInData } from "@/types/index";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const adminAuthState = atom<adminLoggedInData | undefined>({
  key: "adminAuth",
  default: undefined,
  effects: [persistAtom],
});

export const userAuthState = atom<userLoggedInData | undefined>({
  key: "userAuth",
  default: undefined,
  effects: [persistAtom],
});
