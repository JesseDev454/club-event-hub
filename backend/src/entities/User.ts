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
import { Event } from "./Event";
import { RSVP } from "./RSVP";

export enum UserRole {
  STUDENT = "student",
  CLUB_ADMIN = "club_admin",
}

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 120 })
  name!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role!: UserRole;

  @Column({ name: "club_id", type: "uuid", nullable: true })
  clubId!: string | null;

  @ManyToOne(() => Club, { eager: false, nullable: true })
  @JoinColumn({ name: "club_id" })
  club?: Club | null;

  @OneToMany(() => Event, (event) => event.creator)
  createdEvents?: Event[];

  @OneToMany(() => RSVP, (rsvp) => rsvp.user)
  rsvps?: RSVP[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
