/* eslint-disable @typescript-eslint/no-explicit-any */
import "firebase/firestore";
import * as fireorm from "fireorm";
import admin from "firebase-admin";

import serviceAccount from "../serviceAccountKey.json";
import { alias } from "./defaults";

const tbwFirebase = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  },
  alias
);

fireorm.initialize(tbwFirebase.firestore());

export * from "./plugin";
