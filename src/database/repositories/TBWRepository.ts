import { getMongoRepository } from "typeorm";

import TrueBlockWeightModel from "../models/TrueBlockWeight";

export default getMongoRepository(TrueBlockWeightModel);
