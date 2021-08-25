import {MigrationInterface, QueryRunner} from "typeorm";

export class DropMetadataColumnsInDiscordGuildsTable1629934795016 implements MigrationInterface {
    name = 'DropMetadataColumnsInDiscordGuildsTable1629934795016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `discordGuilds` DROP COLUMN `icon`");
        await queryRunner.query("ALTER TABLE `discordGuilds` DROP COLUMN `status`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `discordGuilds` ADD `status` enum ('0', '1', '2', '3') NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `discordGuilds` ADD `icon` varchar(255) NULL");
    }

}
