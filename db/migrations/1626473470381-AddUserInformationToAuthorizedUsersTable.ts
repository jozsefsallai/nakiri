import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserInformationToAuthorizedUsersTable1626473470381 implements MigrationInterface {
    name = 'AddUserInformationToAuthorizedUsersTable1626473470381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `authorizedUsers` ADD `name` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `authorizedUsers` ADD `discriminator` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `authorizedUsers` ADD `image` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `authorizedUsers` DROP COLUMN `image`");
        await queryRunner.query("ALTER TABLE `authorizedUsers` DROP COLUMN `discriminator`");
        await queryRunner.query("ALTER TABLE `authorizedUsers` DROP COLUMN `name`");
    }

}
