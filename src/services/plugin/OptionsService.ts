import { Options } from "../../types";

export default class OptionsService {
  private static options: Options;

  private constructor() {}

  static setOptions(options: Options) {
    OptionsService.options = options;
  }

  static getOptions(): Options {
    return OptionsService.options;
  }
}
