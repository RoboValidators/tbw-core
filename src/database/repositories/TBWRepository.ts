import { getMongoRepository } from "typeorm";

import { TrueBlockWeight as TrueBlockWeightModel } from "../models/trueBlockWeight.entity";

export default getMongoRepository(TrueBlockWeightModel);
