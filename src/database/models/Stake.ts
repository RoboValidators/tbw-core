import { Collection } from "fireorm";

import StakeBase from "./StakeBase";

@Collection("stakes")
export default class Stake extends StakeBase {}
