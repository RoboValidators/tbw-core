import "reflect-metadata";
import { createConnection } from "typeorm";

import { defaults } from "./defaults";

(async () => {
  createConnection({
    type: "mongodb",
    url: `mongodb+srv://${defaults.database.username}:${defaults.database.password}@${defaults.database.url}/${defaults.database.dbName}?retryWrites=true&w=majority`,
    useNewUrlParser: true,
    synchronize: true,
    logging: true,
    entities: ["database/models/*.*"]
  });
})();

export * from "./plugin";
