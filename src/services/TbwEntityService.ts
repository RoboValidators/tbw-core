import { v4 as uuid } from "uuid";

import { Options, Voter, Block } from "../types";
import OptionsService from "./OptionsService";
import { licenseFeeCut, licenseFeeAddress } from "../defaults";
import TrueBlockWeight from "../database/models/TrueBlockWeight";

export default class TbwEntityService {
  private tbw = new TrueBlockWeight();
  private options: Options;

  constructor(licenseFee: string, validatorFee: string, block: Block) {
    this.options = OptionsService.getOptions();
    const licenseFeePercentage = licenseFeeCut * 100;

    this.tbw.id = uuid();
    this.tbw.block = block.height;

    this.push({
      wallet: this.options.validator.payoutAddress,
      share: (this.options.validator.sharePercentage - licenseFeePercentage).toString(),
      reward: validatorFee,
      power: "0"
    });

    this.push({
      wallet: licenseFeeAddress,
      share: licenseFeePercentage.toString(),
      reward: licenseFee,
      power: "0"
    });
  }

  push(voter: Voter): void {
    this.tbw.voters.push(voter);
  }

  getTbw(): TrueBlockWeight {
    return this.tbw;
  }
}
