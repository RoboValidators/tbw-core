import { defaults } from "./defaults";
import { createConnection } from "typeorm";

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
