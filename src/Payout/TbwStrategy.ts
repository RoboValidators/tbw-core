import BigNumber from "bignumber.js";

import { PayoutResult, PayoutStrategy } from "../types";

export default class TbwStrategy implements PayoutStrategy {
  async calculate(
    walletPower: BigNumber,
    allowedVotePower: BigNumber,
    votersRewards: BigNumber
  ): Promise<PayoutResult> {
    // Determine true block weight share of the wallet
    const tbw = walletPower.div(allowedVotePower);

    // Calculate TBW reward (static validator and license fees are already cut off)
    const voterReward = tbw.times(votersRewards);

    return {
      rest: new BigNumber(0),
      reward: voterReward
    };
  }
}
