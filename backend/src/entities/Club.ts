import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Event } from "./Event";
import { User } from "./User";

@Entity({ name: "clubs" })
export class Club {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 120, unique: true })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 100 })
  category!: string;

  @Column({ name: "contact_email", type: "varchar", length: 255, nullable: true })
  contactEmail!: string | null;

  @Column({ type: "varchar", length: 180, nullable: true })
  tagline!: string | null;

  @Column({ name: "owner_user_id", type: "uuid" })
  ownerUserId!: string;

  @OneToOne(() => User, (user) => user.ownedClub, { eager: false })
  @JoinColumn({ name: "owner_user_id" })
  owner!: User;

  @OneToMany(() => Event, (event) => event.club)
  events?: Event[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
