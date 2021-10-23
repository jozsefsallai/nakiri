import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMoreSeverityLevels1635021504491 implements MigrationInterface {
    name = 'AddMoreSeverityLevels1635021504491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` CHANGE `severity` `severity` enum ('0', '1', '2', '3', '4') NOT NULL DEFAULT '2'");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` CHANGE `severity` `severity` enum ('0', '1', '2', '3', '4') NOT NULL DEFAULT '2'");
        await queryRunner.query("ALTER TABLE `linkPatterns` CHANGE `severity` `severity` enum ('0', '1', '2', '3', '4') NOT NULL DEFAULT '2'");
        await queryRunner.query("ALTER TABLE `discordGuilds` CHANGE `severity` `severity` enum ('0', '1', '2', '3', '4') NOT NULL DEFAULT '2'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `discordGuilds` CHANGE `severity` `severity` enum ('0', '1', '2') NOT NULL DEFAULT '2'");
        await queryRunner.query("ALTER TABLE `linkPatterns` CHANGE `severity` `severity` enum ('0', '1', '2') NOT NULL DEFAULT '2'");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` CHANGE `severity` `severity` enum ('0', '1', '2') NOT NULL DEFAULT '2'");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` CHANGE `severity` `severity` enum ('0', '1', '2') NOT NULL DEFAULT '2'");
    }

}
