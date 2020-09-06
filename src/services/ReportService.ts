import axios from "axios";
import { Managers } from "@arkecosystem/crypto";

import db from "../database";
import { BlockDTO, StakeData } from "../types";
import MessageBuilder from "../utils/messageBuilder";
import publisherService from "./PublisherService";
import Parser from "../utils/parser";
import BigNumber from "bignumber.js";
import PriceService from "./PriceService";

export default class ReportService {
  static async check() {
    const lastReport = await db.getLastReport();
    const stakes = await db.getStakes();

    if (stakes.length > 0) {
      const stakeLevels = Object.keys(Managers.configManager.getMilestone().stakeLevels);

      const stakeData: StakeData = [];
      const overallTotal = new BigNumber(0);

      // Get total amount per stakeLevel
      stakeLevels.forEach((stakeLevel) => {
        const filteredStakes = stakes.filter((stake) => stake.duration.toString() === stakeLevel);
        const total = filteredStakes.reduce((acc, stake) => {
          return acc.plus(Parser.normalize(stake.amount));
        }, new BigNumber(0));

        if (!total.isZero()) {
          overallTotal.plus(total);
          stakeData.push({
            stakeLevel,
            total
          });
        }
      });

      // Only publish if totatValue > (minimumAmount/4)
      if (PriceService().isTimesGreaterThan(overallTotal, 0.25)) {
        const status = await MessageBuilder.buildAggroMessage(stakeData, lastReport);
        await publisherService.publishAll(status);

        const { data: blockDTO } = await axios.get<BlockDTO>(
          `http://localhost:4003/api/blocks/last`
        );

        // Set new last published and reset stakes
        await db.setLastReport(blockDTO.data.timestamp.human);
        await db.clearStakes();
      }
    }
  }
}
