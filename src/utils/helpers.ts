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

    const lastVote = votesByWallet.rows.shift();
    const voteMoment = moment(Managers.configManager.getMilestone().epoch).add(
      lastVote.timestamp,
      "seconds"
    );

    const voteAge = moment.duration(moment().diff(voteMoment)).asDays();
    const voteAgePercentage = new BigNumber(100).div(options.voteStages).div(100); // 0,1438190824

    const fullShare = walletPower.div(totalVoteBalance);

    const share =
      options.voteAge !== 0 && voteAge < options.voteAge
        ? voteAgePercentage.times(voteAge).times(fullShare)
        : fullShare;

    const voterReward = share.times(votersRewards);

    logger.info(`=== WALLET ${wallet.address} with vote age ${voteAge} ===`);
    logger.info(`gets ${voterReward} for his ${share} share and ${walletPower} vote power`);

    return {
      share,
      voterReward
    };
  }
}
