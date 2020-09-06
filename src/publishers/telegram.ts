import { Logger } from "@arkecosystem/core-interfaces";
import Client from "node-telegram-bot-api";

import { Publisher, Publishers, Options } from "../types";
import OptionsService from "../services/OptionsService";
import LoggerService from "../services/LoggerService";

export default class Telegram implements Publisher {
  public client: Client;
  public options: Options;
  public logger: Logger.ILogger;

  constructor() {
    this.options = OptionsService.getOptions();
    this.client = new Client(this.options.telegram.token);
    this.logger = LoggerService.getLogger();
  }

  async publish(status: string): Promise<void> {
    try {
      const result = await this.client.sendMessage(this.options.telegram.channelId, status);
      this.logger.info(`Posted ${result.text} on ${result.chat.title}`);
    } catch (error) {
      this.logger.error(JSON.stringify(error, null, 4));
      this.logger.error(
        `[${this.toString()}] failed for status ${status}. Reason: ${error.errors}`
      );
    }
  }

  toString(): string {
    return Publishers.TELEGRAM;
  }
}
