import { Database } from "@arkecosystem/core-interfaces";
import BigNumber from "bignumber.js";

import db from "../database";
import LoggerService from "./LoggerService";
import ContainerService from "./ContainerService";
import { Block, Options, Plugins, Attributes, ValidatorAttrs } from "../types";
import Parser from "../utils/parser";
import TbwEntityService from "./TbwEntityService";
import { licenseFeeCut } from "../defaults";
import Helpers from "../utils/helpers";

export default class TbwService {
  static async check(block: Block, options: Options) {
    // Setup services
    const logger = LoggerService.getLogger();
    const dbService = ContainerService.resolve<Database.IDatabaseService>(Plugins.DATABASE);
    const walletManager = dbService.walletManager;
    const txRepository = dbService.transactionsBusinessRepository;

    // Get all voters for validator
    const voters = walletManager
      .allByAddress()
      .filter((wallet) => wallet.getAttribute<string>("vote") === options.validator.publicKey);

    const filteredVoters = voters.filter((voter) => !options.blacklist.includes(voter.address));
    const blacklistVoters = voters.filter((voter) => options.blacklist.includes(voter.address));

    const blacklistVoteBalance = blacklistVoters.reduce((acc, wallet) => {
      return acc.plus(Helpers.getWalletPower(wallet));
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

    logger.info(`=== Calculating rewards for ${voters.length} voters on block ${block.height} ===`);

    const licenseFee = totalBlockFee.times(licenseFeeCut); // 1% License Fee (ex: 100 block fee: 1 BIND)
    const restRewards = totalBlockFee.times(1 - licenseFeeCut); // 99% Rest Reward (ex: 100 block fee: 99 BIND)
    const votersRewards = restRewards.times(sharePercentage); // Voters cut of the 99 BIND (ex: 90% -> 89,10 BIND)
    const validatorFee = restRewards.times(new BigNumber(1).minus(sharePercentage)); // Validator cut of the 99 BIND (ex: 10% -> 0,99 BIND)

    const tbwEntityService = new TbwEntityService(licenseFee.toString(), block);

    // Calculate reward for this block per voter
    for (const wallet of filteredVoters) {
      const walletPower = Helpers.getWalletPower(wallet);

      const { share, voterReward } = await Helpers.calculatePayout(
        wallet,
        walletPower,
        totalVoteBalance,
        votersRewards,
        txRepository
      );

      totalVotersPayout = totalVotersPayout.plus(voterReward);

      tbwEntityService.push({
        wallet: wallet.address,
        share: share.toString(),
        power: walletPower.toString(),
        reward: voterReward.toString()
      });
    }

    const totalValidatorFee = votersRewards.minus(totalVotersPayout).plus(validatorFee); // Add the additional payout
    const validatorShare = totalValidatorFee.div(votersRewards);

    tbwEntityService.addValidatorFee(totalValidatorFee.toString(), validatorShare.toString());
    tbwEntityService.addStatistics({
      blockReward: totalBlockFee.toString(),
      licenseFee: licenseFee.toString(),
      validatorFee: totalValidatorFee.toString(),
      votersReward: totalVotersPayout.toString(),
      blacklistedPower: blacklistVoteBalance.toString(),
      numberOfBlacklistedVoters: blacklistVoters.length,
      numberOfVoters: voters.length,
      totalPower: totalVoteBalance.toString()
    });

    db.addTbw(tbwEntityService.getTbw());

    /**
     * LOGGING STATISTICS
     */
    tbwEntityService.print();

    // TODO move logging stats
    logger.info(`=== LICENSE FEE ${licenseFee} ===`);
    logger.info(`=== REWARDS AFTER FEE ${restRewards} ===`);
    logger.info(`=== TOTAL PAYOUT TO VOTERS ${totalVotersPayout.toString()} ===`);
    logger.info(`=== VALIDATOR FEE ${totalValidatorFee} ===`);
    logger.info(`=== VALIDATOR SHARE % ${validatorShare} ===`);
    logger.info(`=== TOTAL VOTE POWER ${Parser.normalize(validatorAttrs.voteBalance)} ===`);
    logger.info(`=== TOTAL POWER WITHOUT BLACKLIST ${totalVoteBalance} ===`);
  }
}
