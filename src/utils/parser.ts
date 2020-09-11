import BN from "bignumber.js";

import { ParserType } from "../types";

export default class Parser {
  public static normalize(amount: ParserType) {
    return Parser.toBN(amount).div(1e8);
  }

  public static toBN(value: ParserType) {
    return new BN(value.toString());
  }
}
