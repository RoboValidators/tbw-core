import { getRepository } from "fireorm";

import StakeAnalyticsModel from "../models/StakeAnalytics";

export default getRepository(StakeAnalyticsModel);
