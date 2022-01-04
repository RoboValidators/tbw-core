import VotersModel, { VoterCount } from "../models/Voters";

import { getMongoRepository } from "typeorm";

export default getMongoRepository(VotersModel);

export const voterCountRepository = getMongoRepository(VoterCount);
