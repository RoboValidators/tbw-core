import "reflect-metadata";
import { createConnection } from "typeorm";
import { TrueBlockWeight } from "./database/models/trueBlockWeight.entity";
import { Voter, VoterCount } from "./database/models/voters.entity";
import path from "path";

import { defaults } from "./defaults";

(async () => {
    const entities: string[] = process.env.NODE_ENV === 'development' ? ["./**/*.entity.ts"] : ["./dist/**/*.entity.ts"];
    
    createConnection({
        type: "mongodb",
        url: `mongodb+srv://${defaults.database.username}:${defaults.database.password}@${defaults.database.url}/${defaults.database.dbName}?retryWrites=true&w=majority`,
        useNewUrlParser: true,
        synchronize: true,
        logging: true,
        entities: [path.resolve(__dirname, '**/*.entity{.ts,.js}')]
    });
})();

export * from "./plugin";
