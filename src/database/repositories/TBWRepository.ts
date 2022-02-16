import { getMongoRepository } from "typeorm";

import { TrueBlockWeightModel } from "../models/TrueBlockWeight.entity";

export default getMongoRepository(TrueBlockWeightModel);
