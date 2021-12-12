import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveLegacyGuildAPIKeyField1639324716907 implements MigrationInterface {
    name = 'RemoveLegacyGuildAPIKeyField1639324716907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `authorizedGuilds` DROP COLUMN `key`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `authorizedGuilds` ADD `key` varchar(255) NOT NULL");
    }

}
