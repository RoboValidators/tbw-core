import { Interfaces, Utils } from "@arkecosystem/crypto";
import { Interfaces as StakeInterfaces } from "@nosplatform/stake-transactions-crypto";
import { Container } from "@arkecosystem/core-interfaces";
import BigNumber from "bignumber.js";

export type Stake = StakeInterfaces.IStakeObject;
export type Block = Interfaces.IBlockData;
export type ParserType = Utils.BigNumber | BigNumber | string | number;
export type StakeTimestamps = {
  created: number;
  graceEnd: number;
  powerUp: number;
  redeemable: number;
};

export type StakeData = {
  stakeLevel: string;
  total: BigNumber;
}[];

export interface PowerUp {
  stake: Stake;
  block: Block;
}

export interface PowerUpJob extends PowerUp {
  event: Events;
}

export interface CronJob {
  event: Events;
}

export interface Publisher {
  publish(status: string): Promise<void>;
  toString(): string;
}

export interface Options extends Container.IPluginOptions {
  telegram: {
    token: string;
    channelId: string;
  };
  twitter: {
    consumerKey: string;
    consumerSecret: string;
    accessKey: string;
    accessSecret: string;
  };
  minimumAmount: number;
  startHeight: number;
  txUrl: string;
  token: string;
  currency: string;
  cron: string;
  validator: {
    name: string;
    publicKey: string;
  };
}

export interface BlockDTO {
  data: {
    timestamp: {
      epoch: number;
      unix: number;
      human: Date;
    };
  };
}

export enum Publishers {
  TWITTER = "TWITTER",
  TELEGRAM = "TELEGRAM"
}

export enum Events {
  Cron = "cron",
  BlockApplied = "block.applied"
}
