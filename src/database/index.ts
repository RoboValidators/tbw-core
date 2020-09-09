import tbwRepository from "./repositories/TBWRepository";
import historyRepository from "./repositories/HistoryRepository";
import TbwBase from "./models/TbwBase";
import ForgeStats from "./models/Forge";
import forgeStatsRepository from "./repositories/ForgeStatsRepository";

export default class DB {
  private constructor() {}

  static async addTbw(tbw: TbwBase): Promise<void> {
    await tbwRepository.create(tbw);
    await historyRepository.create(tbw);
  }

  static async addStats(stats: ForgeStats): Promise<void> {
    await forgeStatsRepository.create(stats);
  }
}
