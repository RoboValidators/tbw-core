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

    const voters = walletManager.allByAddress().filter((wallet) => {
      const vote = wallet.getAttribute<string>("vote");
      logger.error(`VOTE IS ${vote}`);
      return wallet.getAttribute<string>("vote") === options.validator.publicKey;
    });

    logger.error(`voter count ${voters.length}`);
  }
}
