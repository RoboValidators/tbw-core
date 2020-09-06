import { Collection } from "fireorm";

@Collection("trueBlockWeight")
export default class TrueBlockWeight {
  id: string;
  wallet: string;
  share: string;
  reward: string;
  block: number;
}
