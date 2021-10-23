import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSeverityToBlacklists1635011039303 implements MigrationInterface {
    name = 'AddSeverityToBlacklists1635011039303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` ADD `severity` enum ('0', '1', '2') NOT NULL DEFAULT '2'");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` ADD `severity` enum ('0', '1', '2') NOT NULL DEFAULT '2'");
        await queryRunner.query("ALTER TABLE `linkPatterns` ADD `severity` enum ('0', '1', '2') NOT NULL DEFAULT '2'");
        await queryRunner.query("ALTER TABLE `discordGuilds` ADD `severity` enum ('0', '1', '2') NOT NULL DEFAULT '2'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `discordGuilds` DROP COLUMN `severity`");
        await queryRunner.query("ALTER TABLE `linkPatterns` DROP COLUMN `severity`");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` DROP COLUMN `severity`");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` DROP COLUMN `severity`");
    }

}
