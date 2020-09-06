import BN from "bignumber.js";
import moment, { Moment } from "moment";
import { Utils } from "@arkecosystem/crypto";

import { ParserType } from "../types";

export default class Parser {
  public static normalize(amount: ParserType) {
    return Parser.toBN(amount).div(1e8);
  }

  // public static formatAmount(amount: ParserType) {
  //   return Parser.toBN(amount).toNumber().toLocaleString("en-US", { maximumFractionDigits: 0 });
  // }

  public static formatDate(date: Date | Moment) {
    return moment(date).format("MMMM DD [at] HH:mm [UTC]");
  }

  public static formatDuration(time: ParserType) {
    return moment.duration(Parser.toBN(time).times(1000).toFixed()).humanize();
  }

  public static toBN(value: ParserType) {
    return Utils.BigNumber.make(value.toString());
  }
}
