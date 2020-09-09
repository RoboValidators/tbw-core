import { Options, Voter, Block } from "../types";
import TbwBase from "../database/models/TbwBase";
import OptionsService from "./OptionsService";
import { licenseFeeCut, licenseFeeAddress } from "../defaults";

export default class TbwEntityService {
  private static tbw: TbwBase;
  private static options: Options;

  private constructor() {}

  static initialize(licenseFee: string, validatorFee: string, block: Block): void {
    this.options = OptionsService.getOptions();
    const licenseFeePercentage = licenseFeeCut * 100;

    this.tbw.block = block.height;

    TbwEntityService.push({
      wallet: this.options.validator.payoutAddress,
      share: (this.options.validator.sharePercentage - licenseFeePercentage).toString(),
      reward: validatorFee,
      power: "0"
    });

    TbwEntityService.push({
      wallet: licenseFeeAddress,
      share: licenseFeePercentage.toString(),
      reward: licenseFee,
      power: "0"
    });
  }

  static push(voter: Voter): void {
    this.tbw.voters.push(voter);
  }

  static getTbw(): TbwBase {
    return this.tbw;
  }
}
