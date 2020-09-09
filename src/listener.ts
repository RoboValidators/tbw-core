import { EventEmitter } from "@arkecosystem/core-interfaces";

import { Events, Options, Block } from "./types";
import TbwService from "./services/TbwService";
import LoggerService from "./services/LoggerService";

class Listener {
  setUp(options: Partial<Options>, emitter: EventEmitter.EventEmitter) {
    emitter.on(Events.BlockApplied, async (block: Block) => {
      if (
        block.height > options.startHeight &&
        options.validator.publicKey === block.generatorPublicKey
      ) {
        TbwService.check(block, options as Options);
      } else {
        const logger = LoggerService.getLogger();
        logger.warn("====BEGIN====");
        logger.warn(`Not my turn yet.. ${block.generatorPublicKey}`);
        logger.warn(options.validator.publicKey);
        logger.warn("====END====");
      }
    });
  }
}

export default new Listener();
