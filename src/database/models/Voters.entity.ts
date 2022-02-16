import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Voter {
  @PrimaryColumn()
  id: string;
  @Column()
  wallet: string;
  @Column()
  paidBalance: string;
  @Column()
  pendingBalance: string;
}

@Entity()
export class VoterCount {
  @PrimaryColumn()
  id: string;
  @Column()
  length: number;
}
