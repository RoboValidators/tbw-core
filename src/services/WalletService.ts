import { State, Database } from "@arkecosystem/core-interfaces";
import { Utils, Managers } from "@arkecosystem/crypto";
import moment from "moment";

import { Attributes, Plugins } from "../types";
import Parser from "../utils/parser";
import ContainerService from "./plugin/ContainerService";

export default class WalletService {
  public static getPower(wallet: State.IWallet) {
    let walletPower = Parser.normalize(wallet.balance);

    if (wallet.hasAttribute(Attributes.STAKEPOWER)) {
      const stakePower = wallet.getAttribute<Utils.BigNumber>(Attributes.STAKEPOWER);
      walletPower = walletPower.plus(Parser.normalize(stakePower));
    }

    return walletPower;
  }

  public static async getVoteAge(wallet: State.IWallet) {
    // Setup services
    const dbService = ContainerService.resolve<Database.IDatabaseService>(Plugins.DATABASE);
    const txRepository = dbService.transactionsBusinessRepository;

    // Get all votes of the wallet (last vote first:desc)
    const votesByWallet = await txRepository.allVotesBySender(wallet.publicKey, {
      orderBy: "timestamp:desc"
    });

    // Get last vote from the array and calculate time of voting
    const lastVote = votesByWallet.rows.shift();
    const voteMoment = moment(Managers.configManager.getMilestone().epoch).add(
      lastVote.timestamp,
      "seconds"
    );

    // Determine voting age in days
    const timeInDays = moment.duration(moment().diff(voteMoment)).asDays();

    console.log(`=== TID ${wallet.address} ===`);
    console.log(`epoch ${Managers.configManager.getMilestone().epoch}`);
    console.log(`voteMoment ${voteMoment}`);
    console.log(`lastVote ${lastVote.timestamp}`);
    console.log(votesByWallet.rows);

    return timeInDays;
  }
}
