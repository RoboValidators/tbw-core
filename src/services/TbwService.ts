import { Database } from "@arkecosystem/core-interfaces";
import { Utils } from "@arkecosystem/crypto";

import db from "../database";
import LoggerService from "./LoggerService";
import ContainerService from "./ContainerService";
import { Block, Options, Plugins, Attributes, ValidatorAttrs } from "../types";
import Parser from "../utils/parser";
import TbwBase from "../database/models/TbwBase";
import ForgeStats from "../database/models/Forge";
import BigNumber from "bignumber.js";
import TbwEntityService from "./TbwEntityService";
import { licenseFeeCut } from "../defaults";

export default class TbwService {
  static async check(block: Block, options: Options) {
    // Setup services
    const logger = LoggerService.getLogger();
    const dbService = ContainerService.resolve<Database.IDatabaseService>(Plugins.DATABASE);
    const walletManager = dbService.walletManager;

    // Get all voters for validator
    const voters = walletManager
      .allByAddress()
      .filter((wallet) => wallet.getAttribute<string>("vote") === options.validator.publicKey);

    // Get validator wallet, delegate attributes and calculate the total block fee
    const validatorWallet = walletManager.findByPublicKey(options.validator.publicKey);
    const validatorAttrs = validatorWallet.getAttribute<ValidatorAttrs>(Attributes.VALIDATOR);

    const totalVoteBalance = Parser.normalize(validatorAttrs.voteBalance);
    const totalBlockFee = Parser.normalize(block.totalFee.plus(block.reward));
    const sharePercentage = new BigNumber(options.validator.sharePercentage).div(100);
    let totalPayout = new BigNumber(0);

    logger.info(`Calculating rewards for ${voters.length} voters on block ${block.height}`);

    const licenseFee = totalBlockFee.times(licenseFeeCut); // 1% License Fee (ex: 100 block fee: 1 BIND)
    const restReward = totalBlockFee.times(1 - licenseFeeCut); // 99% Rest Reward (ex: 100 block fee: 99 BIND)
    const votersReward = restReward.times(sharePercentage); // Voters cut of the 99 BIND (ex: 90% -> 89,10 BIND)
    const validatorReward = restReward.times(new BigNumber(1).minus(sharePercentage)); // Validator cut of the 99 BIND (ex: 10% -> 0,99 BIND)

    TbwEntityService.initialize(licenseFee.toString(), validatorReward.toString(), block);

    // Calculate reward for this block per voter
    for (const wallet of voters) {
      let walletPower = Parser.normalize(wallet.balance);

      if (wallet.hasAttribute(Attributes.STAKEPOWER)) {
        const stakePower = wallet.getAttribute<Utils.BigNumber>(Attributes.STAKEPOWER);
        walletPower = walletPower.plus(Parser.normalize(stakePower));
      }

      const share = Parser.normalize(walletPower).div(totalVoteBalance); // Calculuate Percentage owned of the 89,10 BIND pool (ex: 0,54%)
      const voterReward = share.times(votersReward); // Calculate 0,54% of the 89,10 BIND -> 0,48114 BIND

      // TODO validate -> totalPayout should not exceed 89,10 BIND (+ 1%?)
      totalPayout = totalPayout.plus(voterReward).plus(licenseFee);

      // TODO refactor and keep track of wallet power per block
      // TODO add 1 wallet to TBWs with license fee and 1 for validator fee
      TbwEntityService.push({
        wallet: wallet.address,
        share: share.toString(),
        reward: voterReward.toString(),
        block: block.height
      });
    }

    // TODO refactor to reflect cuts
    const forgeStats = new ForgeStats();
    forgeStats.block = block.height;
    forgeStats.numberOfVoters = voters.length;
    forgeStats.payout = totalPayout.toString();
    forgeStats.blockReward = totalBlockFee.toString();

    db.addBatch(TbwEntityService.getTbws());
    db.addStats(forgeStats);
  }
}
