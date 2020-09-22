import BigNumber from "bignumber.js";

import { PayoutResult, PayoutStrategy } from "../types";

export default class TbwStrategy implements PayoutStrategy {
  // The method to determing the payout of the voter
  // This is seperate logic to allow for easy adjustments to the core payout logic
  async calculate(
    walletPower: BigNumber,
    allowedVotePower: BigNumber,
    votersRewards: BigNumber
  ): Promise<PayoutResult> {
    // Determine true block weight share of the wallet
    const tbw = walletPower.div(allowedVotePower);

    // Calculate reward depending on either the full or cut off share rate
    const voterReward = tbw.times(votersRewards);

    return {
      rest: new BigNumber(0),
      reward: voterReward
    };
  }
}
