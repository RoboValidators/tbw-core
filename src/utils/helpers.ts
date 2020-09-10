import { State, Database } from "@arkecosystem/core-interfaces";
import { Utils, Managers } from "@arkecosystem/crypto";
import BigNumber from "bignumber.js";
import moment from "moment";

import { Attributes } from "../types";
import Parser from "./parser";
import LoggerService from "../services/LoggerService";
import OptionsService from "../services/OptionsService";

export default class Helpers {
  public static getWalletPower = (wallet: State.IWallet) => {
    let walletPower = Parser.normalize(wallet.balance);

    if (wallet.hasAttribute(Attributes.STAKEPOWER)) {
      const stakePower = wallet.getAttribute<Utils.BigNumber>(Attributes.STAKEPOWER);
      walletPower = walletPower.plus(Parser.normalize(stakePower));
    }

    return walletPower;
  };

  // TODO add vote age
  // The method to determing the payout of the voter
  // This is seperate logic to allow for easy adjustments to the core payout logic
  public static async calculatePayout(
    wallet: State.IWallet,
    walletPower: BigNumber,
    totalVoteBalance: BigNumber,
    votersRewards: BigNumber,
    txRepository: Database.ITransactionsBusinessRepository
  ) {
    const logger = LoggerService.getLogger();
    const options = OptionsService.getOptions();

    const votesByWallet = await txRepository.allVotesBySender(wallet.publicKey, {
      orderBy: "timestamp:desc"
    });

    logger.info(`=== WALLET ${wallet.address} last vote: `);

    const lastVote = votesByWallet.rows.shift();

    logger.info(lastVote);
    logger.info(lastVote.timestamp);
    logger.info(lastVote.asset);
    logger.info(`Chain Epoch ${Managers.configManager.getMilestone().epoch}`);
    logger.info(`Chain Epoch ${lastVote.timestamp}`);
    logger.info(
      moment(Managers.configManager.getMilestone().epoch).add(lastVote.timestamp, "seconds")
    );

    const voteMoment = moment(Managers.configManager.getMilestone().epoch).add(
      lastVote.timestamp,
      "seconds"
    );

    const voteAge = moment.duration(moment().diff(voteMoment)).asDays();
    const voteAgePercentage = new BigNumber(100).div(options.voteStages).div(100); // 0,1438190824

    if (options.voteAge !== 0 && voteAge < options.voteAge) {
      const share = voteAgePercentage.times(voteAge);
    }

    const share = walletPower.div(totalVoteBalance); // Calculuate Percentage owned of the 89,10 BIND pool (ex: 0,54%)
    const voterReward = share.times(votersRewards); // Calculate 0,54% of the 89,10 BIND -> 0,48114 BIND

    return {
      share,
      voterReward
    };
  }
}
