import { ITbw } from "../../types";

export default class TbwBase {
  id: string;
  wallet: string;
  share: string;
  reward: string;
  block: number;

  constructor(props: ITbw) {
    this.wallet = props.wallet;
    this.share = props.share;
    this.reward = props.reward;
    this.block = props.block;
  }
}
