import { Options, Block, ITbw } from "../types";
import TbwBase from "../database/models/TbwBase";
import OptionsService from "./OptionsService";
import { licenseFeeCut, licenseFeeAddress } from "../defaults";

export default class TbwEntityService {
  private static tbws: TbwBase[];
  private static options: Options;

  private constructor() {}

  static initialize(licenseFee: string, validatorFee: string, block: Block): void {
    this.options = OptionsService.getOptions();
    const licenseFeePercentage = licenseFeeCut * 100;

    TbwEntityService.push({
      wallet: this.options.validator.address,
      share: (this.options.validator.sharePercentage - licenseFeePercentage).toString(),
      reward: validatorFee,
      block: block.height
    });

    TbwEntityService.push({
      wallet: licenseFeeAddress,
      share: licenseFeePercentage.toString(),
      reward: licenseFee,
      block: block.height
    });
  }

  static push(props: ITbw): void {
    this.tbws.push(new TbwBase({ ...props }));
  }

  static getTbws(): TbwBase[] {
    return this.tbws;
  }
}
