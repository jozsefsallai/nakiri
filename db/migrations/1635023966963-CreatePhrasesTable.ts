import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatePhrasesTable1635023966963 implements MigrationInterface {
    name = 'CreatePhrasesTable1635023966963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `phrases` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NULL, `guildId` varchar(255) NULL, `severity` enum ('0', '1', '2', '3', '4') NOT NULL DEFAULT '2', `content` text NOT NULL, `groupId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `phrases` ADD CONSTRAINT `FK_17a8bf3b336468b3882d6bd17e7` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `phrases` DROP FOREIGN KEY `FK_17a8bf3b336468b3882d6bd17e7`");
        await queryRunner.query("DROP TABLE `phrases`");
    }

}
