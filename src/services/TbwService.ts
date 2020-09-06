import { Block, Options } from "../types";
import { app } from "@arkecosystem/core-container";
import DB from "../database";
import { Database } from "@arkecosystem/core-interfaces";
import LoggerService from "./LoggerService";
// import { IDatabaseService } from "@arkecosystem/core-interfaces";

export default class TbwService {
  static async check(block: Block, options: Options) {
    const logger = LoggerService.getLogger();
    const walletManager = app.resolvePlugin<Database.IDatabaseService>("database").walletManager;

    const voters = walletManager.allByAddress().filter((wallet) => {
      const vote = wallet.getAttribute<string>("vote");
      logger.error(`VOTE IS ${vote}`);
      return wallet.getAttribute<string>("vote") === options.validator.publicKey;
    });

    logger.error(`voter count ${voters.length}`);
  }
}
