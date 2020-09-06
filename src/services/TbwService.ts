import { Database } from "@arkecosystem/core-interfaces";
import { Utils } from "@arkecosystem/crypto";

import DB from "../database";
import LoggerService from "./LoggerService";
import ContainerService from "./ContainerService";
import { Block, Options, Plugins, Attributes, DelegateAttrs, VoterReward } from "../types";
import Parser from "../utils/parser";

export default class TbwService {
  static async check(block: Block, options: Options) {
    const logger = LoggerService.getLogger();
    const dbService = ContainerService.resolve<Database.IDatabaseService>(Plugins.DATABASE);
    const walletManager = dbService.walletManager;

    // Get all voters for validator
    const voters = walletManager
      .allByAddress()
      .filter((wallet) => wallet.getAttribute<string>("vote") === options.validator.publicKey);

    // Get validator wallet, delegate attributes and calculate the total block fee
    const validatorWallet = walletManager.findByPublicKey(options.validator.publicKey);
    const delegateAttrs = validatorWallet.getAttribute<DelegateAttrs>(Attributes.VALIDATOR);
    const totalBlockFee = block.totalFee.minus(block.removedFee);

    logger.info(`Calculating rewards for ${voters.length} voters on block ${block.height}`);

    // Calculate reward for this block per voter
    const votersRewards: VoterReward[] = [];
    for (const wallet of voters) {
      const totalPower = wallet.balance;

      if (wallet.hasAttribute(Attributes.STAKEPOWER)) {
        const stakePower = wallet.getAttribute<Utils.BigNumber>(Attributes.STAKEPOWER);
        totalPower.plus(stakePower);
      }

      const share = totalPower.dividedBy(delegateAttrs.voteBalance);
      const reward = share.times(totalBlockFee);

      votersRewards.push({
        wallet,
        share,
        reward,
        block
      });
    }

    const totalPayout = Utils.BigNumber.ZERO;
    votersRewards.forEach((v) => totalPayout.plus(v.reward));

    logger.info(`=== BEGIN ${block.height} ===`);
    logger.info(`Total block fee: ${totalBlockFee}`);
    logger.info(`block fee: ${block.totalFee}`);
    logger.info(`block fee removed: ${block.removedFee}`);
    logger.info(`to distribute: ${Parser.normalize(totalPayout)}`);
    votersRewards.forEach((v) => {
      logger.info(
        `${v.wallet.address} gets ${Parser.normalize(v.reward)} with share ${Parser.normalize(
          v.share
        )}`
      );
    });
    logger.info(`=== END ${block.height} ===`);
  }
}
