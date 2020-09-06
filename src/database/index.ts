import stakeRepository from "./repositories/StakeRepository";
import reportRepository from "./repositories/ReportRepository";
import stakeAnalyticsRepository from "./repositories/StakeAnalyticsRepository";
import ReportModel from "./models/Report";
import { Stake } from "../types";

const lastReportId = "bindie";

export default class DB {
  private constructor() {}

  static async pushStake(stake: Stake): Promise<void> {
    await stakeRepository.create(stake);
    await stakeAnalyticsRepository.create(stake);
  }

  static async getStakes(): Promise<Stake[]> {
    return stakeRepository.find();
  }

  static async clearStakes(): Promise<void> {
    const stakes = await stakeRepository.find();
    const batch = stakeRepository.createBatch();

    stakes.forEach((stake) => batch.delete(stake));

    await batch.commit();
  }

  static async getLastReport(): Promise<Date> {
    const result = await reportRepository.findById(lastReportId);
    if (result) {
      return result.date;
    }

    // Set new default date
    const newDate = new Date();
    await DB.setLastReport(newDate);
    return newDate;
  }

  static async setLastReport(date: Date): Promise<void> {
    const result = await reportRepository.findById(lastReportId);

    if (result) {
      await reportRepository.update({ ...result, date });
    } else {
      const report = new ReportModel();
      report.id = lastReportId;
      report.date = date;

      await reportRepository.create(report);
    }
  }
}
