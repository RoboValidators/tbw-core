import { Collection } from "fireorm";

@Collection("voters")
export default class Voter {
  id: string;
  wallet: string;
  paidBalance: string;
  pendingBalance: string;
}
