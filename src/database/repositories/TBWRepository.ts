import { getMongoRepository } from "typeorm";

import { TrueBlockWeight as TrueBlockWeightModel } from "../models/TrueBlockWeight.entity";

export default getMongoRepository(TrueBlockWeightModel);
