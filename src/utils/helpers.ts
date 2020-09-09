import { State } from "@arkecosystem/core-interfaces";
import { Utils } from "@arkecosystem/crypto";
import BigNumber from "bignumber.js";

import { Attributes } from "../types";
import Parser from "./parser";

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
  public static calculatePayout(
    walletPower: BigNumber,
    totalVoteBalance: BigNumber,
    votersRewards: BigNumber
  ) {
    const share = Parser.normalize(walletPower).div(totalVoteBalance); // Calculuate Percentage owned of the 89,10 BIND pool (ex: 0,54%)
    const voterReward = share.times(votersRewards); // Calculate 0,54% of the 89,10 BIND -> 0,48114 BIND

    return {
      share,
      voterReward
    };
  }
}
