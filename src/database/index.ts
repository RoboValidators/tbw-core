import tbwRepository from "./repositories/TBWRepository";
import TrueBlockWeight from "./models/TrueBlockWeight";

export default class DB {
  private constructor() {}

  static async addTbw(tbw: TrueBlockWeight): Promise<void> {
    await tbwRepository.create(tbw);
  }
}
