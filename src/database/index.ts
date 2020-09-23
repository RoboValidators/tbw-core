import { Voter } from "../types";
import TrueBlockWeight from "./models/TrueBlockWeight";
import VoterModel from "./models/Voters";
import tbwRepository from "./repositories/TBWRepository";
import voterRepository from "./repositories/VoterRepository";

export default class DB {
  private constructor() {}

  static async addTbw(tbw: TrueBlockWeight): Promise<void> {
    await tbwRepository.create(tbw);
  }

  static async updatePending(voters: Voter[]): Promise<void> {
    const allVoters = await voterRepository.find();
    const voterBatch = voterRepository.createBatch();

    voters.forEach((voter) => {
      const foundWallet = allVoters.find((v) => v.id === voter.wallet);

      if (foundWallet) {
        foundWallet.pendingBalance = voter.reward;
        voterBatch.update(foundWallet);
      } else {
        const newVoter = new VoterModel();
        newVoter.id = voter.wallet;
        newVoter.paidBalance = "0";
        newVoter.wallet = voter.wallet;
        newVoter.pendingBalance = voter.reward;
        voterBatch.create(newVoter);
      }
    });

    await voterBatch.commit();
  }
}
