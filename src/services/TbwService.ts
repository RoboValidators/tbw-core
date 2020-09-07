import { Database } from "@arkecosystem/core-interfaces";
import { Utils } from "@arkecosystem/crypto";

import db from "../database";
import LoggerService from "./LoggerService";
import ContainerService from "./ContainerService";
import { Block, Options, Plugins, Attributes, ValidatorAttrs } from "../types";
import Parser from "../utils/parser";
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

    const filteredVoters = voters.filter((voter) => options.blacklist.includes(voter.address));
    const blacklistVoters = voters.filter((voter) => !options.blacklist.includes(voter.address));

    // TODO abstract this logic (duplicate code);
    const blacklistVoteBalance = blacklistVoters.reduce((acc, wallet) => {
      let walletPower = Parser.normalize(wallet.balance);

      if (wallet.hasAttribute(Attributes.STAKEPOWER)) {
        const stakePower = wallet.getAttribute<Utils.BigNumber>(Attributes.STAKEPOWER);
        walletPower = walletPower.plus(Parser.normalize(stakePower));
      }

      return acc.plus(walletPower);
    }, new BigNumber(0));

    // Get validator wallet, delegate attributes and calculate the total block fee
    const validatorWallet = walletManager.findByPublicKey(options.validator.publicKey);
    const validatorAttrs = validatorWallet.getAttribute<ValidatorAttrs>(Attributes.VALIDATOR);

    const totalVoteBalance = Parser.normalize(validatorAttrs.voteBalance).minus(
      blacklistVoteBalance
    );
    const totalBlockFee = Parser.normalize(block.totalFee.plus(block.reward));
    const sharePercentage = new BigNumber(options.validator.sharePercentage).div(100);
    let totalVotersPayout = new BigNumber(0);

    logger.info(`Calculating rewards for ${voters.length} voters on block ${block.height}`);

    const licenseFee = totalBlockFee.times(licenseFeeCut); // 1% License Fee (ex: 100 block fee: 1 BIND)
    const restRewards = totalBlockFee.times(1 - licenseFeeCut); // 99% Rest Reward (ex: 100 block fee: 99 BIND)
    const votersRewards = restRewards.times(sharePercentage); // Voters cut of the 99 BIND (ex: 90% -> 89,10 BIND)
    const validatorFee = restRewards.times(new BigNumber(1).minus(sharePercentage)); // Validator cut of the 99 BIND (ex: 10% -> 0,99 BIND)

    TbwEntityService.initialize(licenseFee.toString(), validatorFee.toString(), block);

    // Calculate reward for this block per voter
    for (const wallet of filteredVoters) {
      let walletPower = Parser.normalize(wallet.balance);

      if (wallet.hasAttribute(Attributes.STAKEPOWER)) {
        const stakePower = wallet.getAttribute<Utils.BigNumber>(Attributes.STAKEPOWER);
        walletPower = walletPower.plus(Parser.normalize(stakePower));
      }

      const share = Parser.normalize(walletPower).div(totalVoteBalance); // Calculuate Percentage owned of the 89,10 BIND pool (ex: 0,54%)
      const voterReward = share.times(votersRewards); // Calculate 0,54% of the 89,10 BIND -> 0,48114 BIND

      totalVotersPayout = totalVotersPayout.plus(voterReward);

      TbwEntityService.push({
        wallet: wallet.address,
        share: share.toString(),
        power: walletPower.toString(),
        reward: voterReward.toString(),
        block: block.height
      });
    }

    // TODO add blocklist statistics
    const forgeStats = new ForgeStats();
    forgeStats.block = block.height;
    forgeStats.numberOfVoters = voters.length;
    forgeStats.power = totalVoteBalance.toString();
    forgeStats.payout = totalVotersPayout.toString();
    forgeStats.licenseFee = licenseFee.toString();
    forgeStats.validatorFee = validatorFee.toString();
    forgeStats.blockReward = totalBlockFee.toString();

    db.addBatch(TbwEntityService.getTbws());
    db.addStats(forgeStats);
  }
}
