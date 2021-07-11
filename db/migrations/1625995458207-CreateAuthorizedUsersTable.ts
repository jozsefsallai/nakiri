import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateAuthorizedUsersTable1625995458207 implements MigrationInterface {
    name = 'CreateAuthorizedUsersTable1625995458207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `authorizedUsers` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `discordId` varchar(255) NOT NULL, `permissions` int NOT NULL DEFAULT '1', PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `authorizedUsers`");
    }

}
