import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFailedProcessingState1629550508216 implements MigrationInterface {
    name = 'AddFailedProcessingState1629550508216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` CHANGE `status` `status` enum ('0', '1', '2', '3') NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` CHANGE `status` `status` enum ('0', '1', '2', '3') NOT NULL DEFAULT '0'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `youTubeChannelIDs` CHANGE `status` `status` enum ('0', '1', '2') NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `youTubeVideoIDs` CHANGE `status` `status` enum ('0', '1', '2') NOT NULL DEFAULT '0'");
    }

}
