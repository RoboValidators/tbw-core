import { Database } from "@arkecosystem/core-interfaces";

import db from "../database";
import LoggerService from "./LoggerService";
import ContainerService from "./ContainerService";
import { Block, Options, Plugins, Attributes, ValidatorAttrs } from "../types";
import Parser from "../utils/parser";
import TbwBase from "../database/models/TbwBase";

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

    logger.info(`Calculating rewards for ${voters.length} voters on block ${block.height}`);

    // Calculate reward for this block per voter
    const votersRewards: TbwBase[] = [];
    for (const wallet of voters) {
      let totalPower = wallet.balance;

      if (wallet.hasAttribute(Attributes.STAKEPOWER)) {
        const stakePower = wallet.getAttribute(Attributes.STAKEPOWER);
        totalPower = totalPower.plus(stakePower);
      }

      const share = Parser.normalize(totalPower).div(totalVoteBalance);
      const reward = share.times(totalBlockFee);

      votersRewards.push(
        new TbwBase({
          wallet: wallet.address,
          share: share.toString(),
          reward: reward.toString(),
          block: block.height
        })
      );
    }

    db.addBatch(votersRewards);
  }
}
