import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateMonitoredKeywordsTables1627654074867 implements MigrationInterface {
    name = 'CreateMonitoredKeywordsTables1627654074867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `keywordSearchResults` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `url` varchar(255) NOT NULL, `thumbnailUrl` varchar(255) NULL, `uploadDate` datetime NOT NULL, `uploader` varchar(255) NOT NULL, `keywordId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `monitoredKeywords` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `keyword` varchar(255) NOT NULL, `guildId` varchar(255) NOT NULL, `webhookUrl` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `keywordSearchResults` ADD CONSTRAINT `FK_d44e35f72fa79bf6da16b17cfa0` FOREIGN KEY (`keywordId`) REFERENCES `monitoredKeywords`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `keywordSearchResults` DROP FOREIGN KEY `FK_d44e35f72fa79bf6da16b17cfa0`");
        await queryRunner.query("DROP TABLE `monitoredKeywords`");
        await queryRunner.query("DROP TABLE `keywordSearchResults`");
    }

}
