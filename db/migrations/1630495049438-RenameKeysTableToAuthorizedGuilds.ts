import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameKeysTableToAuthorizedGuilds1630495049438 implements MigrationInterface {
    name = 'RenameKeysTableToAuthorizedGuilds1630495049438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable('keys', 'authorizedGuilds');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable('authorizedGuilds', 'keys');
    }

}
