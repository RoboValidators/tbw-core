import { Collection } from "fireorm";

import { Voter } from "../../types";

@Collection("trueBlockWeight")
export default class TrueBlockWeight {
  id: string;
  block: number;
  voters: Voter[];

  constructor() {
    this.voters = [];
  }
}
