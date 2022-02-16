import { VoterCount, VotersModel } from "../models/Voters.entity";

import { getMongoRepository } from "typeorm";

export default getMongoRepository(VotersModel);

export const voterCountRepository = getMongoRepository(VoterCount);
