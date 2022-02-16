import "reflect-metadata";
import { createConnection } from "typeorm";

import { defaults } from "./defaults";

(async () => {
    const entities: string[] = process.env.NODE_ENV === 'development' ? ["./dist/**/*.entity.ts"] : ["./**/*.entity.ts"];
    
    createConnection({
        type: "mongodb",
        url: `mongodb+srv://${defaults.database.username}:${defaults.database.password}@${defaults.database.url}/${defaults.database.dbName}?retryWrites=true&w=majority`,
        useNewUrlParser: true,
        synchronize: true,
        logging: true,
        autoLoadEntities: true,
        entities
    });
})();

export * from "./plugin";
