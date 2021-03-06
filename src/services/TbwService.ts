import BigNumber from "bignumber.js";

import db from "../database";
import { Block, Options } from "../types";
import Parser from "../utils/parser";
import TbwEntityService from "./TbwEntityService";
import { licenseFeePercentage } from "../defaults";
import WalletService from "./WalletService";
import PayoutStrategyFactory from "../Payout/StrategyFactory";
import ValidatorService from "./ValidatorService";
import Helpers from "../utils/helpers";

export default class TbwService {
  static async check(block: Block, options: Options) {
    // Get payout strategy from factory
    const payoutStrategy = PayoutStrategyFactory.get();

    // Get rejected/allowed voters and voteBalances
    const voters = await ValidatorService.getVoters();
    const voteBalances = await ValidatorService.getVoteBalances(voters.rejectedVoters);

    const blockReward = Parser.normalize(block.totalFee.plus(block.reward));
    const sharePercentage = new BigNumber(options.validator.sharePercentage).div(100);
    let totalValidatorReward = new BigNumber(1).minus(sharePercentage).times(blockReward);
    let totalVotersReward = new BigNumber(0);

    const licenseFee = blockReward.times(licenseFeePercentage);
    const votersRewards = blockReward.minus(licenseFee).minus(totalValidatorReward);

    // Initialize TBW Entity
    const tbwEntityService = new TbwEntityService(block.height);

    // Calculate reward per wallet for this block
    for (const wallet of voters.allowedVoters) {
      const walletPower = WalletService.getPower(wallet);
      const voteAge = await WalletService.getVoteAge(wallet);

      // Calculate percentage earned by vote age
      const percentage = await Helpers.calculatePercentage(voteAge);

      // Calculate payout by strategy
      const tbwResult = await payoutStrategy.calculate(
        walletPower,
        voteBalances.allowedVoteBalance,
        votersRewards
      );

      const voterReward = percentage.times(tbwResult.reward);
      const extraValidatorReward = tbwResult.reward.minus(voterReward);

      totalVotersReward = totalVotersReward.plus(voterReward);
      totalValidatorReward = totalValidatorReward.plus(tbwResult.rest).plus(extraValidatorReward);

      tbwEntityService.push({
        wallet: wallet.address,
        power: walletPower.toFixed(8),
        reward: voterReward.toFixed(8),
        fullReward: tbwResult.reward.toFixed(8),
        share: voterReward.div(votersRewards).toFixed(8),
        fullShare: tbwResult.reward.div(votersRewards).toFixed(8),
        voteAge: voteAge.toFixed(8),
        sharePercentage: percentage.toFixed(8)
      });
    }

    // Calculate true validator share and add to Entity Service alogn with license Fee
    const validatorShare = totalValidatorReward.div(votersRewards);
    tbwEntityService.addValidatorFee(totalValidatorReward.toFixed(8), validatorShare.toFixed(8));
    tbwEntityService.addLicenseFee(licenseFee.toFixed(8));

    tbwEntityService.addStatistics({
      blockReward: blockReward.toFixed(8),
      licenseFee: licenseFee.toFixed(8),
      validatorFee: totalValidatorReward.toFixed(8),
      votersReward: totalVotersReward.toFixed(8),
      allowedVoters: voters.allowedVoters.length,
      rejectedVoters: voters.rejectedVoters.length,
      allowedVotePower: voteBalances.allowedVoteBalance.toFixed(8),
      rejectedVotePower: voteBalances.rejectedVoteBalance.toFixed(8)
    });

    // Persist data to database
    await db.addTbw(tbwEntityService.getTbw());

    // Upsert voters
    await db.updatePending(tbwEntityService.getTbw().voters);

    // Print Statistics
    tbwEntityService.print();
  }
}
