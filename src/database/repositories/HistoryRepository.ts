import { getRepository } from "fireorm";

import HistoryModel from "../models/History";

export default getRepository(HistoryModel);
