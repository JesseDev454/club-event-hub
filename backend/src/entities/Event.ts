import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Club } from "./Club";
import { User } from "./User";

@Entity({ name: "events" })
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "club_id", type: "uuid" })
  clubId!: string;

  @ManyToOne(() => Club, (club) => club.events, { eager: false })
  @JoinColumn({ name: "club_id" })
  club!: Club;

  @Column({ name: "created_by", type: "uuid" })
  createdBy!: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: "created_by" })
  creator!: User;

  @Column({ type: "varchar", length: 160 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ name: "event_date", type: "date" })
  eventDate!: string;

  @Column({ name: "start_time", type: "time" })
  startTime!: string;

  @Column({ name: "end_time", type: "time", nullable: true })
  endTime!: string | null;

  @Column({ type: "varchar", length: 160 })
  venue!: string;

  @Column({ type: "varchar", length: 100 })
  category!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
