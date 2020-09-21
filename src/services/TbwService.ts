import { Database } from "@arkecosystem/core-interfaces";
import BigNumber from "bignumber.js";

import db from "../database";
import ContainerService from "./ContainerService";
import { Block, Options, Plugins, Attributes, ValidatorAttrs } from "../types";
import Parser from "../utils/parser";
import TbwEntityService from "./TbwEntityService";
import { licenseFeeCut } from "../defaults";
import Helpers from "../utils/helpers";

BigNumber.config({
  DECIMAL_PLACES: 8,
  ROUNDING_MODE: BigNumber.ROUND_DOWN
});

export default class TbwService {
  static async check(block: Block, options: Options) {
    // Setup services
    const dbService = ContainerService.resolve<Database.IDatabaseService>(Plugins.DATABASE);
    const walletManager = dbService.walletManager;
    const txRepository = dbService.transactionsBusinessRepository;

    // Get all voters for validator
    const voters = walletManager
      .allByAddress()
      .filter((wallet) => wallet.getAttribute<string>("vote") === options.validator.publicKey);

    // Get list of voters and blacklisted voters
    const filteredVoters = voters.filter((voter) => !options.blacklist.includes(voter.address));
    const blacklistedVoters = voters.filter((voter) => options.blacklist.includes(voter.address));

    // Calculate voting power of the blacklisted wallets
    const blacklistedVotePower = blacklistedVoters.reduce((acc, wallet) => {
      return acc.plus(Helpers.getWalletPower(wallet));
    }, new BigNumber(0));

    // Get validator wallet and attributes
    const validatorWallet = walletManager.findByPublicKey(options.validator.publicKey);
    const validatorAttrs = validatorWallet.getAttribute<ValidatorAttrs>(Attributes.VALIDATOR);

    const totalVotePower = Parser.normalize(validatorAttrs.voteBalance).minus(blacklistedVotePower);
    const blockReward = Parser.normalize(block.totalFee.plus(block.reward));
    const sharePercentage = new BigNumber(options.validator.sharePercentage).div(100);
    let totalVotersPayout = new BigNumber(0);

    const licenseFee = blockReward.times(licenseFeeCut); // 1% License Fee (ex: 100 block fee: 1 BIND)
    const restRewards = blockReward.times(1 - licenseFeeCut); // 99% Rest Reward (ex: 100 block fee: 99 BIND)
    const votersRewards = restRewards.times(sharePercentage); // Voters cut of the 99 BIND (ex: 90% -> 89,10 BIND)
    const validatorFee = restRewards.times(new BigNumber(1).minus(sharePercentage)); // Validator cut of the 99 BIND (ex: 10% -> 0,99 BIND)

    // Initialize TBW Entity with prefilled license fee and block height
    const tbwEntityService = new TbwEntityService(licenseFee.toFixed(8), block);

    // Calculate reward per wallet for this block
    for (const wallet of filteredVoters) {
      const result = await Helpers.calculatePayout(
        wallet,
        totalVotePower,
        votersRewards,
        txRepository
      );

      totalVotersPayout = totalVotersPayout.plus(result.reward);

      // TODO klopt dit?
      const voterSharePercentage = new BigNumber(result.share)
        .div(result.fullShare)
        .times(100)
        .toFixed(8);

      tbwEntityService.push({
        wallet: wallet.address,
        share: result.share,
        power: result.power,
        reward: result.reward,
        fullShare: result.fullShare,
        voteAge: result.voteAge,
        sharePercentage: voterSharePercentage
      });
    }

    // Calculate rest reward (due to vote age) and add the validator fee
    const totalValidatorFee = votersRewards.minus(totalVotersPayout).plus(validatorFee);
    // Calculate true validator share
    const validatorShare = totalValidatorFee.div(votersRewards);

    tbwEntityService.addValidatorFee(totalValidatorFee.toFixed(8), validatorShare.toFixed(8));
    tbwEntityService.addStatistics({
      blockReward: blockReward.toFixed(8), // Reward share statistics
      licenseFee: licenseFee.toFixed(8),
      validatorFee: totalValidatorFee.toFixed(8),
      votersReward: totalVotersPayout.toFixed(8),
      numberOfVoters: voters.length, // Voter and blacklist statistics
      numberOfBlacklistedVoters: blacklistedVoters.length,
      totalPower: totalVotePower.toFixed(8),
      blacklistedPower: blacklistedVotePower.toFixed(8)
    });

    // Persist data to database
    db.addTbw(tbwEntityService.getTbw());

    // Print Statistics
    tbwEntityService.print();
  }
}
