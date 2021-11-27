import {MigrationInterface, QueryRunner} from "typeorm";

export class CascadeDeleteKeywordSearchResults1637519363464 implements MigrationInterface {
    name = 'CascadeDeleteKeywordSearchResults1637519363464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `keywordSearchResults` DROP FOREIGN KEY `FK_d44e35f72fa79bf6da16b17cfa0`");
        await queryRunner.query("ALTER TABLE `keywordSearchResults` ADD CONSTRAINT `FK_d44e35f72fa79bf6da16b17cfa0` FOREIGN KEY (`keywordId`) REFERENCES `monitoredKeywords`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `keywordSearchResults` DROP FOREIGN KEY `FK_d44e35f72fa79bf6da16b17cfa0`");
        await queryRunner.query("ALTER TABLE `keywordSearchResults` ADD CONSTRAINT `FK_d44e35f72fa79bf6da16b17cfa0` FOREIGN KEY (`keywordId`) REFERENCES `monitoredKeywords`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE");
    }

}
