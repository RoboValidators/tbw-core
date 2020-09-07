import { Collection } from "fireorm";

import TbwBase from "./TbwBase";
import { ITbw } from "../../types";

@Collection("trueBlockWeight")
export default class TrueBlockWeight extends TbwBase {
  constructor(props?: ITbw) {
    super(props);
  }
}
