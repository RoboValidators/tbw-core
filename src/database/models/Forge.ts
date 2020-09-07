import { Collection } from "fireorm";

@Collection("forgeStats")
export default class ForgeStats {
  id: string;
  block: number; // Block height for stats
  payout: string; // Payout to voters for this block
  blockReward: string; // Total rewards for this block
  numberOfVoters: number; // Amount of voters for this block
  licenseFee: string; // Fee for usage of the license for this block
  validatorFee: string; // Fee for the validator for this block
  power: string; // Total voting power of the validator for this block
}
