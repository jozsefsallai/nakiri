import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateKeywordWhitelistedChannelTable1628023066564 implements MigrationInterface {
    name = 'CreateKeywordWhitelistedChannelTable1628023066564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `keywordWhitelistedChannels` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `channelId` varchar(255) NOT NULL, `guildId` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `keywordWhitelistedChannels`");
    }

}
