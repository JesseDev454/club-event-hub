import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddClubOwnership1743940800000 implements MigrationInterface {
  name = "AddClubOwnership1743940800000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "clubs",
      new TableColumn({
        name: "owner_user_id",
        type: "uuid",
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      "clubs",
      new TableForeignKey({
        name: "fk_clubs_owner_user_id",
        columnNames: ["owner_user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      }),
    );

    const adminUsersWithoutClub = await queryRunner.query(`
      SELECT "id"
      FROM "users"
      WHERE "role" = 'club_admin'
        AND "club_id" IS NULL
      LIMIT 1
    `);

    if (adminUsersWithoutClub.length > 0) {
      throw new Error("Migration aborted: found club_admin users without an assigned club.");
    }

    const duplicateClubLinks = await queryRunner.query(`
      SELECT "club_id"
      FROM "users"
      WHERE "club_id" IS NOT NULL
      GROUP BY "club_id"
      HAVING COUNT(*) > 1
      LIMIT 1
    `);

    if (duplicateClubLinks.length > 0) {
      throw new Error("Migration aborted: multiple users are linked to the same club.");
    }

    const clubsWithoutAdmin = await queryRunner.query(`
      SELECT c."id"
      FROM "clubs" c
      LEFT JOIN "users" u
        ON u."club_id" = c."id"
       AND u."role" = 'club_admin'
      GROUP BY c."id"
      HAVING COUNT(u."id") = 0
      LIMIT 1
    `);

    if (clubsWithoutAdmin.length > 0) {
      throw new Error("Migration aborted: found clubs without a matching club_admin owner.");
    }

    const clubsWithMultipleAdmins = await queryRunner.query(`
      SELECT c."id"
      FROM "clubs" c
      JOIN "users" u
        ON u."club_id" = c."id"
       AND u."role" = 'club_admin'
      GROUP BY c."id"
      HAVING COUNT(u."id") > 1
      LIMIT 1
    `);

    if (clubsWithMultipleAdmins.length > 0) {
      throw new Error("Migration aborted: found clubs with multiple matching club_admin users.");
    }

    await queryRunner.query(`
      UPDATE "clubs" c
      SET "owner_user_id" = u."id"
      FROM "users" u
      WHERE u."role" = 'club_admin'
        AND u."club_id" = c."id"
    `);

    const clubsWithoutOwnerAfterBackfill = await queryRunner.query(`
      SELECT "id"
      FROM "clubs"
      WHERE "owner_user_id" IS NULL
      LIMIT 1
    `);

    if (clubsWithoutOwnerAfterBackfill.length > 0) {
      throw new Error("Migration aborted: owner backfill left one or more clubs without an owner.");
    }

    await queryRunner.query(`
      ALTER TABLE "clubs"
      ALTER COLUMN "owner_user_id" SET NOT NULL
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_clubs_owner_user_id"
      ON "clubs" ("owner_user_id")
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_users_club_id_not_null"
      ON "users" ("club_id")
      WHERE "club_id" IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "uq_users_club_id_not_null"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "uq_clubs_owner_user_id"`);
    await queryRunner.dropForeignKey("clubs", "fk_clubs_owner_user_id");
    await queryRunner.dropColumn("clubs", "owner_user_id");
  }
}
