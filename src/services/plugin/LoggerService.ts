import { Logger } from "@arkecosystem/core-interfaces";

export default class LoggerService {
  private static logger: Logger.ILogger;

  private constructor() {}

  static setLogger(logger: Logger.ILogger) {
    LoggerService.logger = logger;
  }

  static getLogger(): Logger.ILogger {
    return LoggerService.logger;
  }
}
