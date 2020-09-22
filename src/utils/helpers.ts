import BigNumber from "bignumber.js";

import OptionsService from "../services/plugin/OptionsService";

export default class Helpers {
  public static async calculatePercentage(voteAge: number) {
    const options = OptionsService.getOptions();

    const configuredVoteStages = options.voteStages === 0 ? 1 : options.voteStages;
    const minPercentage =
      options.minPercentage === 0
        ? new BigNumber(1).div(1e8)
        : new BigNumber(options.minPercentage).div(100);

    const percentageIncrease = new BigNumber(100)
      .minus(minPercentage)
      .div(configuredVoteStages)
      .div(100);

    console.log("========================");
    console.log(`Vote Age ${voteAge}`);
    console.log(`configuredVoteStages ${configuredVoteStages}`);
    console.log(`minPercentage ${minPercentage}`);
    console.log(`voteAge < options.voteAge ${voteAge < options.voteAge}`);
    console.log(`immature % ${percentageIncrease.times(voteAge).plus(minPercentage)}`);
    console.log("========================");

    return voteAge < options.voteAge
      ? percentageIncrease.times(voteAge).plus(minPercentage)
      : new BigNumber(1);
  }
}
