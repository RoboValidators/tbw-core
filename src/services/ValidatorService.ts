import { Database } from "@arkecosystem/core-interfaces";
import { IWallet } from "@arkecosystem/core-interfaces/dist/core-state";
import BigNumber from "bignumber.js";
import { Attributes, Plugins, ValidatorAttrs } from "../types";
import Parser from "../utils/parser";

import ContainerService from "./ContainerService";
import OptionsService from "./OptionsService";
import WalletService from "./WalletService";

export default class ValidatorService {
  static async getVoters() {
    // Setup services
    const options = OptionsService.getOptions();
    const dbService = ContainerService.resolve<Database.IDatabaseService>(Plugins.DATABASE);
    const walletManager = dbService.walletManager;

    // Get all voters for validator
    const voters = walletManager
      .allByAddress()
      .filter((wallet) => wallet.getAttribute<string>("vote") === options.validator.publicKey);

    // Get list of voters and blacklisted voters
    const allowedVoters = voters.filter((voter) => !options.blacklist.includes(voter.address));
    const rejectedVoters = voters.filter((voter) => options.blacklist.includes(voter.address));

    return {
      allowedVoters,
      rejectedVoters
    };
  }

  static async getVoteBalances(rejectedVoters: IWallet[]) {
    // Setup services
    const options = OptionsService.getOptions();
    const dbService = ContainerService.resolve<Database.IDatabaseService>(Plugins.DATABASE);
    const walletManager = dbService.walletManager;

    // Get validator wallet and attributes
    const validatorWallet = walletManager.findByPublicKey(options.validator.publicKey);
    const validatorAttrs = validatorWallet.getAttribute<ValidatorAttrs>(Attributes.VALIDATOR);

    // Calculate voting power of the rejected wallets
    const rejectedVoteBalance = rejectedVoters.reduce((acc, wallet) => {
      return acc.plus(WalletService.getPower(wallet));
    }, new BigNumber(0));

    const allowedVoteBalance = Parser.normalize(validatorAttrs.voteBalance).minus(
      rejectedVoteBalance
    );

    return {
      allowedVoteBalance,
      rejectedVoteBalance
    };
  }
}
