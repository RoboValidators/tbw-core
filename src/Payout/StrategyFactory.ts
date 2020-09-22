/* eslint-disable indent */
import OptionsService from "../services/OptionsService";
import { PayoutStrategies, PayoutStrategy } from "../types";
import TbwStrategy from "./TbwStrategy";

export default class PayoutStrategyFactory {
  public static get(strategy?: PayoutStrategies): PayoutStrategy {
    const strat = strategy || OptionsService.getOptions().strategy;

    switch (strat) {
      case PayoutStrategies.TrueBlockWeight:
        return new TbwStrategy();
      default:
        return new TbwStrategy();
    }
  }
}
