import { State, Database } from "@arkecosystem/core-interfaces";
import { Utils, Managers } from "@arkecosystem/crypto";
import BigNumber from "bignumber.js";
import moment from "moment";

import { Attributes } from "../types";
import Parser from "./parser";
import OptionsService from "../services/OptionsService";

BigNumber.config({
  DECIMAL_PLACES: 8,
  ROUNDING_MODE: BigNumber.ROUND_DOWN
});

export default class Helpers {
  public static getWalletPower(wallet: State.IWallet) {
    let walletPower = Parser.normalize(wallet.balance);

    if (wallet.hasAttribute(Attributes.STAKEPOWER)) {
      const stakePower = wallet.getAttribute<Utils.BigNumber>(Attributes.STAKEPOWER);
      walletPower = walletPower.plus(Parser.normalize(stakePower));
    }

    return walletPower;
  }

  // The method to determing the payout of the voter
  // This is seperate logic to allow for easy adjustments to the core payout logic
  public static async calculatePayout(
    wallet: State.IWallet,
    totalVoteBalance: BigNumber,
    votersRewards: BigNumber,
    txRepository: Database.ITransactionsBusinessRepository
  ) {
    // Setup services
    const options = OptionsService.getOptions();

    // Get wallet voting power and all votes of the wallet (last vote first:desc)
    const walletPower = Helpers.getWalletPower(wallet);
    const votesByWallet = await txRepository.allVotesBySender(wallet.publicKey, {
      orderBy: "timestamp:desc"
    });

    // Get last vote from the array and calculate time of voting
    const lastVote = votesByWallet.rows.shift();
    const voteMoment = moment(Managers.configManager.getMilestone().epoch).add(
      lastVote.timestamp,
      "seconds"
    );

    // Determine voting age in days and derive a votinge percentage based on it
    const voteAge = moment.duration(moment().diff(voteMoment)).asDays();

    const minPercentage = new BigNumber(options.minPercentage).div(100);
    const percentageIncrease = new BigNumber(100)
      .minus(options.minPercentage)
      .div(options.voteStages)
      .div(100);

    const voteAgePercentage = percentageIncrease.times(voteAge).plus(minPercentage);

    // Determine true block weight share of the wallet
    const fullShare = walletPower.div(totalVoteBalance);

    // Cut off true block weight share when vote isn't matured yet
    const share =
      options.voteAge !== 0 && voteAge < options.voteAge
        ? voteAgePercentage.times(fullShare)
        : fullShare;

    // Calculate reward depending on either the full or cut off share rate
    const voterReward = share.times(votersRewards);

    // TODO determine percentage cut for this block?
    return {
      fullShare: fullShare.times(100).toFixed(8), // Parse to percentages
      share: share.times(100).toFixed(8), // Parse to percentages
      power: walletPower.toFixed(8),
      reward: voterReward.toFixed(8)
    };
  }
}
