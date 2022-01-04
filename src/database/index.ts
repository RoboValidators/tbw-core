import BigNumber from "bignumber.js";

import { Voter } from "../types";
import TrueBlockWeight from "./models/TrueBlockWeight";
import VoterModel from "./models/Voters";
import tbwRepository from "./repositories/TBWRepository";
import voterRepository, { voterCountRepository } from "./repositories/VoterRepository";
import LoggerService from "../services/plugin/LoggerService";

export default class DB {
  private constructor() {}

  static async addTbw(tbw: TrueBlockWeight): Promise<void> {
    const foundTbw = await tbwRepository.findOne({ id: tbw.id });
    if (foundTbw) {
      LoggerService.getLogger().error(`TBW for blockheight ${tbw.id} already exists`);
    } else {
      tbwRepository.insertOne(tbw);
    }
  }

  static async updatePending(voters: Voter[]): Promise<void> {
    let newVoters = 0;

    for await (const voter of voters) {
      const foundWallet = await voterRepository.findOne({ id: voter.wallet });

      if (foundWallet) {
        foundWallet.pendingBalance = new BigNumber(foundWallet.pendingBalance)
          .plus(voter.reward)
          .toFixed(8);

        voterRepository.updateOne({ id: voter.wallet }, foundWallet);
      } else {
        const newVoter = new VoterModel();
        newVoter.id = voter.wallet;
        newVoter.wallet = voter.wallet;
        newVoter.paidBalance = "0";
        newVoter.pendingBalance = voter.reward;
        voterRepository.insertOne(newVoter);
        newVoters++;
      }
    }

    // Update new voters count
    const count = await voterCountRepository.findOne({ id: "count" });

    if (count) {
      await voterCountRepository.insertOne({
        id: "count",
        length: count.length + newVoters
      });
    } else {
      await voterCountRepository.insertOne({
        id: "count",
        length: newVoters
      });
    }
  }
}
