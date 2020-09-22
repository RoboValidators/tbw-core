import { v4 as uuid } from "uuid";

import { Options, Voter } from "../types";
import OptionsService from "./OptionsService";
import { licenseFeePercentage, licenseFeeAddress } from "../defaults";
import TrueBlockWeight from "../database/models/TrueBlockWeight";

export default class TbwEntityService {
  private tbw = new TrueBlockWeight();
  private options: Options;

  constructor(licenseFee: string) {
    this.options = OptionsService.getOptions();

    this.tbw.id = uuid();

    // Add license fee entry
    this.push({
      wallet: licenseFeeAddress,
      share: licenseFeePercentage.toString(),
      fullShare: licenseFeePercentage.toString(),
      reward: licenseFee,
      power: "0",
      voteAge: "0",
      sharePercentage: "100"
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
      sharePercentage: "100"
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

  addStatistics({
    blockHeight,
    blockReward,
    votersReward,
    licenseFee,
    validatorFee,
    totalPower,
    blacklistedPower,
    numberOfVoters,
    numberOfBlacklistedVoters
  }): void {
    this.tbw.block = blockHeight;
    this.tbw.blockReward = blockReward;
    this.tbw.votersReward = votersReward;
    this.tbw.licenseFee = licenseFee;
    this.tbw.validatorFee = validatorFee;
    this.tbw.totalPower = totalPower;
    this.tbw.blacklistedPower = blacklistedPower;
    this.tbw.numberOfVoters = numberOfVoters;
    this.tbw.numberOfBlacklistedVoters = numberOfBlacklistedVoters;
  }

  print() {
    const { voters, ...rest } = this.tbw;
    console.table(rest);
    console.table(voters);
  }
}
