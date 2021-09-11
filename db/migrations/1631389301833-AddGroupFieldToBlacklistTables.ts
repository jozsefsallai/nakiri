import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGroupFieldToBlacklistTables1631389301833 implements MigrationInterface {
    name = 'AddGroupFieldToBlacklistTables1631389301833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` ADD `groupId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` ADD `groupId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `linkPatterns` ADD `groupId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `discordGuilds` ADD `groupId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` ADD CONSTRAINT `FK_520170be1b574d064d36262417f` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` ADD CONSTRAINT `FK_29badbc9883b266c7246c8b3224` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `linkPatterns` ADD CONSTRAINT `FK_b15952b02371c608d9bba4465e7` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `discordGuilds` ADD CONSTRAINT `FK_f1223a6e8875b1c2181de7dc031` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `discordGuilds` DROP FOREIGN KEY `FK_f1223a6e8875b1c2181de7dc031`");
        await queryRunner.query("ALTER TABLE `linkPatterns` DROP FOREIGN KEY `FK_b15952b02371c608d9bba4465e7`");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` DROP FOREIGN KEY `FK_29badbc9883b266c7246c8b3224`");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` DROP FOREIGN KEY `FK_520170be1b574d064d36262417f`");
        await queryRunner.query("ALTER TABLE `discordGuilds` DROP COLUMN `groupId`");
        await queryRunner.query("ALTER TABLE `linkPatterns` DROP COLUMN `groupId`");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` DROP COLUMN `groupId`");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` DROP COLUMN `groupId`");
    }

}
