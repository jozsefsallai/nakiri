import {MigrationInterface, QueryRunner} from "typeorm";

export class AddYouTubeMetadataFields1629549686046 implements MigrationInterface {
    name = 'AddYouTubeMetadataFields1629549686046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` ADD `deletedAt` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` ADD `status` enum ('0', '1', '2') NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` ADD `title` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` ADD `description` text NULL");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` ADD `thumbnailUrl` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` ADD `uploadDate` datetime NULL");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` ADD `uploaderId` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` ADD `uploaderName` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` ADD `deletedAt` datetime(6) NULL");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` ADD `status` enum ('0', '1', '2') NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` ADD `name` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` ADD `description` text NULL");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` ADD `publishedAt` datetime NULL");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` ADD `thumbnailUrl` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `linkPatterns` ADD `deletedAt` datetime(6) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `linkPatterns` DROP COLUMN `deletedAt`");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` DROP COLUMN `thumbnailUrl`");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` DROP COLUMN `publishedAt`");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` DROP COLUMN `name`");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` DROP COLUMN `status`");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` DROP COLUMN `deletedAt`");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` DROP COLUMN `uploaderName`");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` DROP COLUMN `uploaderId`");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` DROP COLUMN `uploadDate`");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` DROP COLUMN `thumbnailUrl`");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` DROP COLUMN `title`");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` DROP COLUMN `status`");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` DROP COLUMN `deletedAt`");
    }

}
