import { ITbw, Voter } from "../../types";

export default class TbwBase {
  id: string;
  block: number;
  voters: Voter[];

  constructor(props: ITbw) {
    this.block = props.block;
    this.voters = props.voters;
  }
}
