import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Club } from "./Club";
import { RSVP } from "./RSVP";
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

  @OneToMany(() => RSVP, (rsvp) => rsvp.event)
  rsvps?: RSVP[];

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

  @Column({ type: "text", array: true, default: () => "'{}'" })
  highlights!: string[];

  @Column({ name: "target_audience", type: "text", array: true, default: () => "'{}'" })
  targetAudience!: string[];

  @Column({ name: "additional_info", type: "text", nullable: true })
  additionalInfo!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
