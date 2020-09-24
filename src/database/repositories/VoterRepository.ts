import { getRepository } from "fireorm";

import VotersModel from "../models/Voters";

export default getRepository(VotersModel);
