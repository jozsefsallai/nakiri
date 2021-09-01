import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGroupTables1630532486473 implements MigrationInterface {
    name = 'AddGroupTables1630532486473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `groups` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `description` varchar(255) NULL, `apiKey` varchar(255) NOT NULL, `creatorId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `groupMembers` (`id` varchar(36) NOT NULL, `permissions` int NOT NULL DEFAULT '1', `userId` varchar(36) NULL, `groupId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `authorized_guilds_groups_groups` (`authorizedGuildsId` varchar(36) NOT NULL, `groupsId` varchar(36) NOT NULL, INDEX `IDX_f5b6f3ec820c14ac519dfcbda0` (`authorizedGuildsId`), INDEX `IDX_4f0314f65ed92eb8af85779e46` (`groupsId`), PRIMARY KEY (`authorizedGuildsId`, `groupsId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `groups` ADD CONSTRAINT `FK_accb24ba8f4f213f33d08e2a20f` FOREIGN KEY (`creatorId`) REFERENCES `authorizedUsers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `groupMembers` ADD CONSTRAINT `FK_707e2d7e186d11bf587210223ab` FOREIGN KEY (`userId`) REFERENCES `authorizedUsers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `groupMembers` ADD CONSTRAINT `FK_08cacea15f2aef324f78fddebff` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `authorized_guilds_groups_groups` ADD CONSTRAINT `FK_f5b6f3ec820c14ac519dfcbda03` FOREIGN KEY (`authorizedGuildsId`) REFERENCES `authorizedGuilds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `authorized_guilds_groups_groups` ADD CONSTRAINT `FK_4f0314f65ed92eb8af85779e46e` FOREIGN KEY (`groupsId`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `authorized_guilds_groups_groups` DROP FOREIGN KEY `FK_4f0314f65ed92eb8af85779e46e`");
        await queryRunner.query("ALTER TABLE `authorized_guilds_groups_groups` DROP FOREIGN KEY `FK_f5b6f3ec820c14ac519dfcbda03`");
        await queryRunner.query("ALTER TABLE `groupMembers` DROP FOREIGN KEY `FK_08cacea15f2aef324f78fddebff`");
        await queryRunner.query("ALTER TABLE `groupMembers` DROP FOREIGN KEY `FK_707e2d7e186d11bf587210223ab`");
        await queryRunner.query("ALTER TABLE `groups` DROP FOREIGN KEY `FK_accb24ba8f4f213f33d08e2a20f`");
        await queryRunner.query("DROP INDEX `IDX_4f0314f65ed92eb8af85779e46` ON `authorized_guilds_groups_groups`");
        await queryRunner.query("DROP INDEX `IDX_f5b6f3ec820c14ac519dfcbda0` ON `authorized_guilds_groups_groups`");
        await queryRunner.query("DROP TABLE `authorized_guilds_groups_groups`");
        await queryRunner.query("DROP TABLE `groupMembers`");
        await queryRunner.query("DROP TABLE `groups`");
    }

}
