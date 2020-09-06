import { Logger } from "@arkecosystem/core-interfaces";
import Tweeter from "twitter-lite";

import { Publisher, Publishers, Options } from "../types";
import OptionsService from "../services/OptionsService";
import LoggerService from "../services/LoggerService";

export default class Twitter implements Publisher {
  public client: Tweeter;
  public options: Options;
  public logger: Logger.ILogger;

  constructor() {
    this.options = OptionsService.getOptions();
    this.client = new Tweeter({
      consumer_key: this.options.twitter.consumerKey,
      consumer_secret: this.options.twitter.consumerSecret,
      access_token_key: this.options.twitter.accessKey,
      access_token_secret: this.options.twitter.accessSecret
    });
    this.logger = LoggerService.getLogger();
  }

  async publish(status: string): Promise<void> {
    try {
      const result = await this.client.post("statuses/update", {
        status
      });
      this.logger.info(`Posted ${result.text} on ${result.user.name}`);
    } catch (error) {
      this.logger.error(JSON.stringify(error, null, 4));
      this.logger.error(
        `[${this.toString()}] failed for status ${status}. Reason: ${error.errors}`
      );
    }
  }

  toString(): string {
    return Publishers.TWITTER;
  }
}
