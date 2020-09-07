import tbwRepository from "./repositories/TBWRepository";
import historyRepository from "./repositories/HistoryRepository";
import TbwBase from "./models/TbwBase";
import ForgeStats from "./models/Forge";
import forgeStatsRepository from "./repositories/ForgeStatsRepository";

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

  static async addStats(stats: ForgeStats): Promise<void> {
    await forgeStatsRepository.create(stats);
  }
}
