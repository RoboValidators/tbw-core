import "reflect-metadata";
import { createConnection } from "typeorm";

import { defaults } from "./defaults";

(async () => {
    console.log("starting...");
                try {
  createConnection({
    type: "mongodb",
    url: `mongodb+srv://${defaults.database.username}:${defaults.database.password}@${defaults.database.url}/${defaults.database.dbName}?retryWrites=true&w=majority`,
    useNewUrlParser: true,
    synchronize: true,
    logging: true,
    entities: [__dirname + "/database/models/*.ts"]
  });
} catch (e) {
    console.log(e);
}
    console.log("ending...");
})();

export * from "./plugin";
