import { VoterCount, Voter as VotersModel } from "../models/voters.entity";

import { getMongoRepository } from "typeorm";

export default getMongoRepository(VotersModel);

export const voterCountRepository = getMongoRepository(VoterCount);
