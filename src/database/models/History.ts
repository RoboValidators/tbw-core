import { Collection } from "fireorm";

import TbwBase from "./TbwBase";
import { ITbw } from "../../types";

@Collection("history")
export default class History extends TbwBase {
  constructor(props?: ITbw) {
    super(props);
  }
}
