import tbwRepository from "./repositories/TBWRepository";
import ForgeStats from "./models/Forge";
import forgeStatsRepository from "./repositories/ForgeStatsRepository";
import TrueBlockWeight from "./models/TrueBlockWeight";

export default class DB {
  private constructor() {}

  static async addTbw(tbw: TrueBlockWeight): Promise<void> {
    await tbwRepository.create(tbw);
  }

  static async addStats(stats: ForgeStats): Promise<void> {
    await forgeStatsRepository.create(stats);
  }
}
