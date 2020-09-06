import { Publisher } from "../types";
import Twitter from "../publishers/twitter";
import Telegram from "../publishers/telegram";

export default class PublisherService {
  private static publishers: Publisher[];

  private constructor() {}

  static getPublishers(): Publisher[] {
    if (!PublisherService.publishers) {
      PublisherService.publishers = [new Twitter(), new Telegram()];
    }

    return PublisherService.publishers;
  }

  static async publishAll(status: string) {
    const publishPromises = PublisherService.getPublishers().map((p) => p.publish(status));
    await Promise.all(publishPromises);
  }
}
