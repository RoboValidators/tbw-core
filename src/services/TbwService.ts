import { Block, Options } from "../types";
import DB from "../database";
import { Database, Container } from "@arkecosystem/core-interfaces";
import LoggerService from "./LoggerService";
// import { IDatabaseService } from "@arkecosystem/core-interfaces";

export default class TbwService {
  static async check(block: Block, container: Container.IContainer, options: Options) {
    const logger = LoggerService.getLogger();
    const walletManager = container.resolvePlugin<Database.IDatabaseService>("database")
      .walletManager;

    const AllVoters = walletManager
      .allByAddress()
      .filter((wallet) => wallet.getAttribute<string>("vote") === options.validator.publicKey);

    const validatorWallet = walletManager.findByPublicKey(options.validator.publicKey);
    logger.info(`validator wallet attrs`);
    logger.info(validatorWallet.getAttributes());
    logger.info(`validator wallet`);
    logger.info(validatorWallet);

    logger.error(`voter count ${AllVoters.length}`);
  }
}
