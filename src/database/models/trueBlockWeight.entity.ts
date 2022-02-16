import { Entity, Column, PrimaryColumn } from "typeorm";

import { Voter as VoterType } from "../../types";
import { Voter } from "./voters.entity";

@Entity()
export class TrueBlockWeight {
  @PrimaryColumn()
  id: string;
  @Column()
  block: number;
  @Column(() => Voter)
  voters: VoterType[];

  /**
   * Payout statistics per block
   */
  @Column()
  blockReward: string; // Total rewards available for distribution
  @Column()
  votersReward: string; // Total amount being paid to voters
  @Column()
  licenseFee: string; // Fee for usage of the license
  @Column()
  validatorFee: string; // Fee for the validator

  /**
   * Voter statistics per block
   */
  @Column()
  allowedVotePower: string; // Voting power of all allowed wallets
  @Column()
  rejectedVotePower: string; // Voting power of all rejected wallets
  @Column()
  allowedVoters: number; // Amount of voters allowed
  @Column()
  rejectedVoters: number; // Amount of voters rejected
  @Column()
  totalVoters: number; // Total amount of voters
  @Column()
  totalVotePower: string; // Total amount of voting power

  constructor() {
    this.voters = [];
  }
}
