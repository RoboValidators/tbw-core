import { Collection } from "fireorm";

import StakeBase from "./StakeBase";

@Collection("stakesAnalytics")
export default class StakeAnalytics extends StakeBase {}
