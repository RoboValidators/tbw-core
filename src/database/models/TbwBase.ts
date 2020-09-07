import { ITbw } from "../../types";

export default class TbwBase {
  id: string;
  wallet: string;
  share: string;
  reward: string;
  block: number;
  power: string;

  constructor(props: ITbw) {
    this.wallet = props.wallet;
    this.share = props.share;
    this.reward = props.reward;
    this.block = props.block;
    this.power = props.power;
  }
}
