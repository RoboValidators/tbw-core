import { Collection } from "fireorm";

import { Voter } from "../../types";

@Collection("trueBlockWeight")
export default class TrueBlockWeight {
  id: string;
  block: number;
  voters: Voter[];

  /**
   * Payout statistics per block
   */
  blockReward: string; // Total rewards available for distribution
  votersReward: string; // Total amount being paid to voters
  licenseFee: string; // Fee for usage of the license
  validatorFee: string; // Fee for the validator

  /**
   * Voter statistics per block
   */
  allowedVotePower: string; // Voting power of all allowed wallets
  rejectedVotePower: string; // Voting power of all rejected wallets
  allowedVoters: number; // Amount of voters allowed
  rejectedVoters: number; // Amount of voters rejected
  totalVoters: number; // Total amount of voters
  totalVotePower: string; // Total amount of voting power

  constructor() {
    this.voters = [];
  }
}
