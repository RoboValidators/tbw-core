import tbwRepository from "./repositories/TBWRepository";
import TrueBlockWeightModel from "./models/TrueBlockWeight";

export default class DB {
  private constructor() {}

  static async addBatch(tbws: TrueBlockWeightModel[]): Promise<void> {
    const batch = tbwRepository.createBatch();

    tbws.forEach((tbw) => batch.create(tbw));

    await batch.commit();
  }

  // static async getLastReport(): Promise<Date> {
  //   const result = await reportRepository.findById(lastReportId);
  //   if (result) {
  //     return result.date;
  //   }

  //   // Set new default date
  //   const newDate = new Date();
  //   await DB.setLastReport(newDate);
  //   return newDate;
  // }

  // static async setLastReport(date: Date): Promise<void> {
  //   const result = await reportRepository.findById(lastReportId);

  //   if (result) {
  //     await reportRepository.update({ ...result, date });
  //   } else {
  //     const report = new ReportModel();
  //     report.id = lastReportId;
  //     report.date = date;

  //     await reportRepository.create(report);
  //   }
  // }
}
