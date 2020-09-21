import { Interfaces, Utils } from "@arkecosystem/crypto";
import { Container, State } from "@arkecosystem/core-interfaces";
import BigNumber from "bignumber.js";

export type ValidatorAttrs = State.IWalletDelegateAttributes;
export type ParserType = Utils.BigNumber | BigNumber | string | number;

export interface ITbw {
  block: number;
  voters: Voter[];
}

export interface Voter {
  wallet: string;
  reward: string;
  power: string;
  share: string;
  fullShare: string;
  sharePercentage: string;
  voteAge: string;
}

export interface Publisher {
  publish(status: string): Promise<void>;
  toString(): string;
}

export interface Options extends Container.IPluginOptions {
  blacklist: string[];
  voteAge: number;
  voteStages: number;
  minPercentage: number;
  startHeight: number;
  validator: {
    name: string;
    publicKey: string;
    payoutAddress: string;
    sharePercentage: number;
  };
}

// TODO - use interface of @compendia/crypto when published
export interface Block {
  id?: string;
  idHex?: string;

  timestamp: number;
  version: number;
  height: number;
  previousBlockHex?: string;
  previousBlock: string;
  numberOfTransactions: number;
  totalAmount: Utils.BigNumber;
  totalFee: Utils.BigNumber;
  removedFee: Utils.BigNumber;
  reward: Utils.BigNumber;
  payloadLength: number;
  payloadHash: string;
  generatorPublicKey: string;

  blockSignature?: string;
  serialized?: string;
  transactions?: Interfaces.ITransactionData[];
}

export enum Publishers {
  TWITTER = "TWITTER",
  TELEGRAM = "TELEGRAM"
}

export enum Events {
  BlockApplied = "block.applied"
}

export enum Plugins {
  DATABASE = "database",
  LOGGER = "logger",
  EVENT_EMITTER = "event-emitter"
}

export enum Attributes {
  STAKEPOWER = "stakePower",
  VALIDATOR = "delegate"
}
