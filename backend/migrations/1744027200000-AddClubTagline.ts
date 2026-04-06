import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from "typeorm";

export class AddClubTagline1744027200000 implements MigrationInterface {
  name = "AddClubTagline1744027200000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "clubs",
      new TableColumn({
        name: "tagline",
        type: "varchar",
        length: "180",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("clubs", "tagline");
  }
}
