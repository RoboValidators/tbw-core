import { getRepository } from "fireorm";

import VotersModel, { VoterCount } from "../models/Voters";

export default getRepository(VotersModel);

export const voterCountRepository = getRepository(VoterCount);
