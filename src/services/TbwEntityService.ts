import BigNumber from "bignumber.js";

import { Options, Voter } from "../types";
import OptionsService from "./plugin/OptionsService";
import { licenseFeePercentage, licenseFeeAddress } from "../defaults";
import TrueBlockWeight from "../database/models/TrueBlockWeight";

export default class TbwEntityService {
  private tbw = new TrueBlockWeight();
  private options: Options;

  constructor(block: number) {
    this.options = OptionsService.getOptions();
    this.tbw.id = block.toString();
    this.tbw.block = block;
  }

  addLicenseFee(licenseFee: string): void {
    // Add license fee entry
    this.push({
      wallet: licenseFeeAddress,
      share: licenseFeePercentage.toString(),
      fullShare: licenseFeePercentage.toString(),
      reward: licenseFee,
      power: "0",
      voteAge: "0",
      sharePercentage: "1",
      fullReward: licenseFee
    });
  }

  addValidatorFee(validatorFee: string, validatorShare: string): void {
    // Add validator fee entry
    this.push({
      wallet: this.options.validator.payoutAddress,
      share: validatorShare,
      fullShare: validatorShare,
      reward: validatorFee,
      power: "0",
      voteAge: "0",
      sharePercentage: "1",
      fullReward: validatorFee
    });
  }

  // Add any voter entry
  push(voter: Voter): void {
    this.tbw.voters.push(voter);
  }

  // Retrieve complete entity
  getTbw(): TrueBlockWeight {
    return this.tbw;
  }

  addStatistics(partialTbw: Partial<TrueBlockWeight>): void {
    // Rewards
    this.tbw.blockReward = partialTbw.blockReward;
    this.tbw.votersReward = partialTbw.votersReward;
    this.tbw.licenseFee = partialTbw.licenseFee;
    this.tbw.validatorFee = partialTbw.validatorFee;

    // Voters
    this.tbw.allowedVoters = partialTbw.allowedVoters;
    this.tbw.rejectedVoters = partialTbw.rejectedVoters;
    this.tbw.allowedVotePower = partialTbw.allowedVotePower;
    this.tbw.rejectedVotePower = partialTbw.rejectedVotePower;

    // Totals
    this.tbw.totalVoters = partialTbw.allowedVoters + partialTbw.rejectedVoters;
    this.tbw.totalVotePower = new BigNumber(partialTbw.allowedVotePower)
      .plus(partialTbw.rejectedVotePower)
      .toFixed(8);
  }

  print() {
    const { voters, ...rest } = this.tbw;
    console.table(rest);
    console.table(voters);
  }
}
