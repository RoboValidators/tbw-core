import { Collection } from "fireorm";

@Collection("lastReport")
export default class ReportModel {
  id: string;
  date: Date;
}
