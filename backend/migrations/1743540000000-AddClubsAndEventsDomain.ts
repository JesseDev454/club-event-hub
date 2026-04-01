import {
  type MigrationInterface,
  type QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class AddClubsAndEventsDomain1743540000000 implements MigrationInterface {
  name = "AddClubsAndEventsDomain1743540000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("clubs", [
      new TableColumn({
        name: "name",
        type: "varchar",
        length: "120",
        isNullable: true,
      }),
      new TableColumn({
        name: "description",
        type: "text",
        isNullable: true,
      }),
      new TableColumn({
        name: "category",
        type: "varchar",
        length: "100",
        isNullable: true,
      }),
      new TableColumn({
        name: "contact_email",
        type: "varchar",
        length: "255",
        isNullable: true,
      }),
    ]);

    await queryRunner.query(`
      UPDATE "clubs"
      SET
        "name" = COALESCE("name", CONCAT('Club ', SUBSTRING("id"::text, 1, 8))),
        "description" = COALESCE("description", 'Campus club profile coming soon.'),
        "category" = COALESCE("category", 'General'),
        "contact_email" = COALESCE("contact_email", NULL)
    `);

    await queryRunner.changeColumn(
      "clubs",
      "name",
      new TableColumn({
        name: "name",
        type: "varchar",
        length: "120",
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      "clubs",
      "description",
      new TableColumn({
        name: "description",
        type: "text",
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      "clubs",
      "category",
      new TableColumn({
        name: "category",
        type: "varchar",
        length: "100",
        isNullable: false,
      }),
    );

    await queryRunner.createIndex(
      "clubs",
      new TableIndex({
        name: "idx_clubs_name_unique",
        columnNames: ["name"],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "events",
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
            name: "club_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "created_by",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "title",
            type: "varchar",
            length: "160",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: false,
          },
          {
            name: "event_date",
            type: "date",
            isNullable: false,
          },
          {
            name: "start_time",
            type: "time",
            isNullable: false,
          },
          {
            name: "end_time",
            type: "time",
            isNullable: true,
          },
          {
            name: "venue",
            type: "varchar",
            length: "160",
            isNullable: false,
          },
          {
            name: "category",
            type: "varchar",
            length: "100",
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
      }),
      true,
    );

    await queryRunner.createForeignKeys("events", [
      new TableForeignKey({
        name: "fk_events_club_id",
        columnNames: ["club_id"],
        referencedTableName: "clubs",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        name: "fk_events_created_by",
        columnNames: ["created_by"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    ]);

    await queryRunner.createIndices("events", [
      new TableIndex({
        name: "idx_events_event_date",
        columnNames: ["event_date"],
      }),
      new TableIndex({
        name: "idx_events_club_id",
        columnNames: ["club_id"],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("events", "idx_events_club_id");
    await queryRunner.dropIndex("events", "idx_events_event_date");
    await queryRunner.dropForeignKey("events", "fk_events_created_by");
    await queryRunner.dropForeignKey("events", "fk_events_club_id");
    await queryRunner.dropTable("events");

    await queryRunner.dropIndex("clubs", "idx_clubs_name_unique");
    await queryRunner.dropColumn("clubs", "contact_email");
    await queryRunner.dropColumn("clubs", "category");
    await queryRunner.dropColumn("clubs", "description");
    await queryRunner.dropColumn("clubs", "name");
  }
}
