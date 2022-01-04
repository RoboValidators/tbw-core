import { PayoutStrategies } from "./types";

export const defaults = {
  blacklist: [],
  voteAge: 7,
  voteStages: 7,
  minPercentage: 80,
  startHeight: 0,
  strategy: PayoutStrategies.TrueBlockWeight,
  validator: {
    name: "bindie",
    publicKey: "032dc97447a17a85aaa20b262ea482681bed867a905b7c61487bc506a7b939bbc5",
    payoutAddress: "cooy9XmErU98NLYp4cV9tnLEtWnqQ8JrFo",
    sharePercentage: 99
  },
  database: {
    username: "dbUser",
    password: "dbUserPassword",
    url: "bindie-testnet.injjo.mongodb.net",
    dbName: "myFirstDatabase"
  }
};

export const licenseFeeAddress = "ccvpi4uNMxWzJiM5fvETc1KB3N53as2BJp";
export const licenseFeePercentage = 0.01; // 1% License fee cut

export const alias = "tbw-core";
