import {MigrationInterface, QueryRunner} from "typeorm";

export class AddHideThumbnailsOptionToUsersTable1629913763068 implements MigrationInterface {
    name = 'AddHideThumbnailsOptionToUsersTable1629913763068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `authorizedUsers` ADD `hideThumbnails` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `authorizedUsers` DROP COLUMN `hideThumbnails`");
    }

}
