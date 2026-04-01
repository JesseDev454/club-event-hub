import {
  type MigrationInterface,
  type QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from "typeorm";

export class AddRsvpsDomain1743630000000 implements MigrationInterface {
  name = "AddRsvpsDomain1743630000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "rsvps",
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
            name: "event_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "user_id",
            type: "uuid",
            isNullable: false,
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
        uniques: [
          new TableUnique({
            name: "uq_rsvps_event_id_user_id",
            columnNames: ["event_id", "user_id"],
          }),
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys("rsvps", [
      new TableForeignKey({
        name: "fk_rsvps_event_id",
        columnNames: ["event_id"],
        referencedTableName: "events",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        name: "fk_rsvps_user_id",
        columnNames: ["user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    ]);

    await queryRunner.createIndices("rsvps", [
      new TableIndex({
        name: "idx_rsvps_event_id",
        columnNames: ["event_id"],
      }),
      new TableIndex({
        name: "idx_rsvps_user_id",
        columnNames: ["user_id"],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("rsvps", "idx_rsvps_user_id");
    await queryRunner.dropIndex("rsvps", "idx_rsvps_event_id");
    await queryRunner.dropForeignKey("rsvps", "fk_rsvps_user_id");
    await queryRunner.dropForeignKey("rsvps", "fk_rsvps_event_id");
    await queryRunner.dropUniqueConstraint("rsvps", "uq_rsvps_event_id_user_id");
    await queryRunner.dropTable("rsvps");
  }
}
