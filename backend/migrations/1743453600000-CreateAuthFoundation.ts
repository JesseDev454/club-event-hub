import {
  type MigrationInterface,
  type QueryRunner,
  Table,
  TableCheck,
  TableForeignKey,
} from "typeorm";

export class CreateAuthFoundation1743453600000 implements MigrationInterface {
  name = "CreateAuthFoundation1743453600000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: "clubs",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp with time zone",
            default: "now()",
          },
        ],
      }),
      true,
    );

    await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM ('student', 'club_admin')`);

    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            length: "120",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "password_hash",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "role",
            type: "users_role_enum",
            default: `'student'`,
          },
          {
            name: "club_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp with time zone",
            default: "now()",
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      "users",
      new TableForeignKey({
        name: "fk_users_club_id",
        columnNames: ["club_id"],
        referencedTableName: "clubs",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    );

    await queryRunner.createCheckConstraint(
      "users",
      new TableCheck({
        name: "chk_users_role_club_id",
        expression:
          `(("role" = 'student' AND "club_id" IS NULL) OR ("role" = 'club_admin' AND "club_id" IS NOT NULL))`,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropCheckConstraint("users", "chk_users_role_club_id");
    await queryRunner.dropForeignKey("users", "fk_users_club_id");
    await queryRunner.dropTable("users");
    await queryRunner.query(`DROP TYPE "users_role_enum"`);
    await queryRunner.dropTable("clubs");
  }
}
