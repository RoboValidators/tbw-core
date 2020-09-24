import { Collection } from "fireorm";

@Collection("voters")
export default class Voter {
  id: string;
  paidBalance: string;
  pendingBalance: string;
}
