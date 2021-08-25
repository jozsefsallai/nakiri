import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateDiscordGuildsTable1629927216805 implements MigrationInterface {
    name = 'CreateDiscordGuildsTable1629927216805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `discordGuilds` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NULL, `guildId` varchar(255) NULL, `blacklistedId` varchar(255) NOT NULL, `status` enum ('0', '1', '2', '3') NOT NULL DEFAULT '0', `name` varchar(255) NULL, `icon` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `discordGuilds`");
    }

}
