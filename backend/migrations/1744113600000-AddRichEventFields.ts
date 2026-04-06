import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from "typeorm";

export class AddRichEventFields1744113600000 implements MigrationInterface {
  name = "AddRichEventFields1744113600000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("events", [
      new TableColumn({
        name: "highlights",
        type: "text",
        isArray: true,
        isNullable: false,
        default: "'{}'",
      }),
      new TableColumn({
        name: "target_audience",
        type: "text",
        isArray: true,
        isNullable: false,
        default: "'{}'",
      }),
      new TableColumn({
        name: "additional_info",
        type: "text",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("events", "additional_info");
    await queryRunner.dropColumn("events", "target_audience");
    await queryRunner.dropColumn("events", "highlights");
  }
}
