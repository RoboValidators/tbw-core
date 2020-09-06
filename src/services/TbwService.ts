import { Database } from "@arkecosystem/core-interfaces";
import { Utils } from "@arkecosystem/crypto";

import DB from "../database";
import LoggerService from "./LoggerService";
import ContainerService from "./ContainerService";
import { Block, Options, Plugins, Attributes, ValidatorAttrs, VoterReward } from "../types";
import Parser from "../utils/parser";
// import Parser from "../utils/parser";

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

    const totalVoteBalance = validatorAttrs.voteBalance;
    const totalBlockFee = block.totalFee.plus(block.reward);

    logger.info(`Calculating rewards for ${voters.length} voters on block ${block.height}`);

    // Calculate reward for this block per voter
    const votersRewards: VoterReward[] = [];
    for (const wallet of voters) {
      let totalPower = wallet.balance;

      if (wallet.hasAttribute(Attributes.STAKEPOWER)) {
        const stakePower = wallet.getAttribute(Attributes.STAKEPOWER);
        totalPower = totalPower.plus(stakePower);
      }

      const nTotalPower = Parser.normalize(totalPower);
      const ntotalVoteBalance = Parser.normalize(totalVoteBalance);

      const share = Utils.BigNumber.make(nTotalPower.div(ntotalVoteBalance).times(1e8).toString());
      const reward = share.times(totalBlockFee);

      votersRewards.push({
        wallet: wallet.address,
        share,
        reward,
        blockHeight: block.height
      });

      logger.info(`=== BEGIN ${block.height} ===`);
      votersRewards.forEach((v) => {
        logger.info(v.wallet);
        logger.info(v.reward);
        logger.info(v.share);
      });
      logger.info(`=== END ${block.height} ===`);
    }
  }
}
