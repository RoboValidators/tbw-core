import { EventEmitter } from "@arkecosystem/core-interfaces";

import { Events, Options, Block } from "./types";
import TbwService from "./services/TbwService";

class Listener {
  setUp(options: Partial<Options>, emitter: EventEmitter.EventEmitter) {
    emitter.on(Events.BlockApplied, async (block: Block) => {
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
