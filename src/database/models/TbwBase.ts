import { Voter } from "../../types";

export default class TbwBase {
  id: string;
  block: number;
  voters: Voter[];
}
