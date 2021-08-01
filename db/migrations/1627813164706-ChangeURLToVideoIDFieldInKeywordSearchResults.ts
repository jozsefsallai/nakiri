import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeURLToVideoIDFieldInKeywordSearchResults1627813164706 implements MigrationInterface {
    name = 'ChangeURLToVideoIDFieldInKeywordSearchResults1627813164706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `keywordSearchResults` CHANGE `url` `videoId` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `keywordSearchResults` CHANGE `videoId` `url` varchar(255) NOT NULL");
    }

}
