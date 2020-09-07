import tbwRepository from "./repositories/TBWRepository";
import historyRepository from "./repositories/HistoryRepository";
import TbwBase from "./models/TbwBase";

export default class DB {
  private constructor() {}

  static async addBatch(tbws: TbwBase[]): Promise<void> {
    const tbwBatch = tbwRepository.createBatch();
    const historyBatch = historyRepository.createBatch();

    tbws.forEach((tbw) => {
      tbwBatch.create(tbw);
      historyBatch.create(tbw);
    });

    await tbwBatch.commit();
    await historyBatch.commit();
  }
}
