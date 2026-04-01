import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Event } from "./Event";

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

  @OneToMany(() => Event, (event) => event.club)
  events?: Event[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
