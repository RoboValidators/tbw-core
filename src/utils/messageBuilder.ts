import moment from "moment";

import OptionsService from "../services/OptionsService";
import PriceService from "../services/PriceService";
import { Stake, StakeData } from "../types";
import Parser from "./parser";

export default class MessageBuilder {
  public static async buildPowerMessage(stake: Stake): Promise<string> {
    const options = OptionsService.getOptions();

    // stake.amount actually isn't a BN
    const amount = Parser.normalize(stake.amount);
    const totalAmount = await PriceService().getTotalPrice(amount);

    const duration = Parser.formatDuration(stake.duration);
    const formattedAmount = Parser.formatAmount(amount);
    const totalAmountFormatted = Parser.formatAmount(totalAmount);

    const preMessage = `🚨 Big BIND Stake alert 🚨\n\n`;
    const baseMessage = `${formattedAmount} $BIND (${totalAmountFormatted} ${options.currency}) is being staked for ${duration}`;
    const postMessage = `\n\n🔗 Transaction: ${options.txUrl}/${stake.id}`;

    if (await PriceService().isTimesGreaterThan(amount, 4)) {
      return `${preMessage}🔊 ${baseMessage} 🤯🏅 ${postMessage}`;
    }

    if (await PriceService().isTimesGreaterThan(amount, 3)) {
      return `${preMessage}🔊 ${baseMessage} 💥🔥 ${postMessage}`;
    }

    if (await PriceService().isTimesGreaterThan(amount, 2)) {
      return `${preMessage}🔊 ${baseMessage} 💰 ${postMessage}`;
    }

    // When amount is below x2 and above minimum
    return `${preMessage}🔊 ${baseMessage} 📨 ${postMessage}`;
  }

  public static async buildAggroMessage(stakeData: StakeData, lastReport: Date): Promise<string> {
    const options = OptionsService.getOptions();

    const sinceDate = Parser.formatDate(lastReport);
    const sinceHours = moment().diff(moment(lastReport), "hours");

    let baseMessage = `⌛📜 Stakes since the last report of ${sinceDate} (${sinceHours} hours ago):\n\n`;

    for (const stake of stakeData) {
      const { total, stakeLevel } = stake;

      const totalFormatted = Parser.formatAmount(total);
      const priceTotalAmount = await PriceService().getTotalPrice(total);
      const priceTotalAmountFormatted = Parser.formatAmount(priceTotalAmount);
      const duration = Parser.formatDuration(stakeLevel);

      if (!total.isZero()) {
        baseMessage += `${totalFormatted} BIND (${priceTotalAmountFormatted} ${options.currency}) staked for ${duration}\n`;
      }
    }

    return `${baseMessage}\n~ $BIND #bindreport #compendia 💎`;
  }
}
