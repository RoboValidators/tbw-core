import { Stake } from "../types";
import MessageBuilder from "../utils/messageBuilder";
import publisherService from "./PublisherService";
import Parser from "../utils/parser";
import PriceService from "./PriceService";

export default class PowerupService {
  static async check(stake: Stake) {
    const amount = Parser.normalize(stake.amount);

    if (await PriceService().isTimesGreaterThan(amount)) {
      const status = await MessageBuilder.buildPowerMessage(stake);
      await publisherService.publishAll(status);
    }
  }
}
