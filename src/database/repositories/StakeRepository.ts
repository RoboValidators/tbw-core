import { getRepository } from "fireorm";

import StakeModel from "../models/Stake";

export default getRepository(StakeModel);
