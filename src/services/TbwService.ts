import { Database } from "@arkecosystem/core-interfaces";

import DB from "../database";
import LoggerService from "./LoggerService";
import ContainerService from "./ContainerService";
import { Block, Options, Plugins, Attributes, ValidatorAttrs, VoterReward } from "../types";
import Parser from "../utils/parser";
import BigNumber from "bignumber.js";

export default class TbwService {
  static async check(block: Block, options: Options) {
    // Setup services
    const logger = LoggerService.getLogger();
    const dbService = ContainerService.resolve<Database.IDatabaseService>(Plugins.DATABASE);
    const walletManager = dbService.walletManager;

    // Normalize values and parse to true BigNumbers
    const blockTotalFee = Parser.normalize(block.totalFee);
    const blockReward = Parser.normalize(block.reward);

    // Get all voters for validator
    const voters = walletManager
      .allByAddress()
      .filter((wallet) => wallet.getAttribute<string>("vote") === options.validator.publicKey);

    // Get validator wallet, delegate attributes and calculate the total block fee
    const validatorWallet = walletManager.findByPublicKey(options.validator.publicKey);
    const validatorAttrs = validatorWallet.getAttribute<ValidatorAttrs>(Attributes.VALIDATOR);

    const totalVoteBalance = Parser.normalize(validatorAttrs.voteBalance);
    const totalBlockFee = blockTotalFee.plus(blockReward);

    logger.info(`Calculating rewards for ${voters.length} voters on block ${block.height}`);

    // Calculate reward for this block per voter
    const votersRewards: VoterReward[] = [];
    for (const wallet of voters) {
      const totalPower = Parser.normalize(wallet.balance);

      if (wallet.hasAttribute(Attributes.STAKEPOWER)) {
        const stakePower = wallet.getAttribute(Attributes.STAKEPOWER);
        totalPower.plus(Parser.normalize(stakePower));
      }

      logger.info(`Total Power for ${wallet.address}: ${totalPower}`);

      const share = totalPower.div(totalVoteBalance);
      const reward = share.times(totalBlockFee);

      logger.info(`delegate vote blanace ${totalVoteBalance}`);
      logger.info(`Share for ${wallet.address}: ${share}`);
      logger.info(`Share for ${wallet.address}: ${reward}`);

      votersRewards.push({
        wallet,
        share,
        reward,
        block
      });
    }

    const totalPayout = new BigNumber(0);
    votersRewards.forEach((v) => totalPayout.plus(v.reward));

    logger.info(`=== BEGIN ${block.height} ===`);
    logger.info(`Total block fee: ${totalBlockFee}`);
    logger.info(`block reward: ${block.reward}`);
    logger.info(`block fee: ${block.totalFee}`);
    logger.info(`block fee removed: ${block.removedFee}`);
    logger.info(`to distribute: ${totalPayout}`);
    votersRewards.forEach((v) => {
      logger.info(`${v.wallet.address} gets ${v.reward} with share ${v.share}`);
    });
    logger.info(`=== END ${block.height} ===`);
  }
}
