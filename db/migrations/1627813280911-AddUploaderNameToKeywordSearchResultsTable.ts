import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUploaderNameToKeywordSearchResultsTable1627813280911 implements MigrationInterface {
    name = 'AddUploaderNameToKeywordSearchResultsTable1627813280911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `keywordSearchResults` ADD `uploaderName` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `keywordSearchResults` DROP COLUMN `uploaderName`");
    }

}
