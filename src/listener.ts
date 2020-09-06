import { EventEmitter } from "@arkecosystem/core-interfaces";

import { Events, Options, BlockApplied } from "./types";
import TbwService from "./services/TbwService";
import LoggerService from "./services/LoggerService";

class Listener {
  setUp(options: Partial<Options>, emitter: EventEmitter.EventEmitter) {
    // Setup powerUp trigger and queue
    emitter.on(Events.BlockApplied, async ({ block }: BlockApplied) => {
      LoggerService.getLogger().info(`vkey ========= ${options.validator.publicKey} ===========`);
      LoggerService.getLogger().info(`block key ========= ${block.generatorPublicKey} ===========`);

      if (
        block.height > options.startHeight &&
        options.validator.publicKey === block.generatorPublicKey
      ) {
        TbwService.check(block, options as Options);
      }
    });
  }
}

export default new Listener();
