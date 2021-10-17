import { MigrationInterface, QueryRunner } from 'typeorm';

export class GroupCascadeOnDelete1634482763655 implements MigrationInterface {
  name = 'GroupCascadeOnDelete1634482763655';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `groupMembers` DROP FOREIGN KEY `FK_08cacea15f2aef324f78fddebff`',
    );
    await queryRunner.query(
      'ALTER TABLE `groupMembers` DROP FOREIGN KEY `FK_707e2d7e186d11bf587210223ab`',
    );
    await queryRunner.query(
      'ALTER TABLE `youTubeVideoIDs` DROP FOREIGN KEY `FK_520170be1b574d064d36262417f`',
    );
    await queryRunner.query(
      'ALTER TABLE `youTubeChannelIDs` DROP FOREIGN KEY `FK_29badbc9883b266c7246c8b3224`',
    );
    await queryRunner.query(
      'ALTER TABLE `linkPatterns` DROP FOREIGN KEY `FK_b15952b02371c608d9bba4465e7`',
    );
    await queryRunner.query(
      'ALTER TABLE `discordGuilds` DROP FOREIGN KEY `FK_f1223a6e8875b1c2181de7dc031`',
    );
    await queryRunner.query(
      'ALTER TABLE `authorized_guilds_groups_groups` DROP FOREIGN KEY `FK_4f0314f65ed92eb8af85779e46e`',
    );
    await queryRunner.query(
      'ALTER TABLE `groups` DROP FOREIGN KEY `FK_accb24ba8f4f213f33d08e2a20f`',
    );
    await queryRunner.query(
      'ALTER TABLE `keywordSearchResults` DROP FOREIGN KEY `FK_d44e35f72fa79bf6da16b17cfa0`',
    );
    await queryRunner.query(
      'ALTER TABLE `groupMembers` ADD CONSTRAINT `FK_707e2d7e186d11bf587210223ab` FOREIGN KEY (`userId`) REFERENCES `authorizedUsers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `groupMembers` ADD CONSTRAINT `FK_08cacea15f2aef324f78fddebff` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `groups` ADD CONSTRAINT `FK_accb24ba8f4f213f33d08e2a20f` FOREIGN KEY (`creatorId`) REFERENCES `authorizedUsers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `youTubeVideoIDs` ADD CONSTRAINT `FK_520170be1b574d064d36262417f` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `youTubeChannelIDs` ADD CONSTRAINT `FK_29badbc9883b266c7246c8b3224` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `linkPatterns` ADD CONSTRAINT `FK_b15952b02371c608d9bba4465e7` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `discordGuilds` ADD CONSTRAINT `FK_f1223a6e8875b1c2181de7dc031` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `keywordSearchResults` ADD CONSTRAINT `FK_d44e35f72fa79bf6da16b17cfa0` FOREIGN KEY (`keywordId`) REFERENCES `monitoredKeywords`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `authorized_guilds_groups_groups` ADD CONSTRAINT `FK_4f0314f65ed92eb8af85779e46e` FOREIGN KEY (`groupsId`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `authorized_guilds_groups_groups` DROP FOREIGN KEY `FK_4f0314f65ed92eb8af85779e46e`',
    );
    await queryRunner.query(
      'ALTER TABLE `keywordSearchResults` DROP FOREIGN KEY `FK_d44e35f72fa79bf6da16b17cfa0`',
    );
    await queryRunner.query(
      'ALTER TABLE `discordGuilds` DROP FOREIGN KEY `FK_f1223a6e8875b1c2181de7dc031`',
    );
    await queryRunner.query(
      'ALTER TABLE `linkPatterns` DROP FOREIGN KEY `FK_b15952b02371c608d9bba4465e7`',
    );
    await queryRunner.query(
      'ALTER TABLE `youTubeChannelIDs` DROP FOREIGN KEY `FK_29badbc9883b266c7246c8b3224`',
    );
    await queryRunner.query(
      'ALTER TABLE `youTubeVideoIDs` DROP FOREIGN KEY `FK_520170be1b574d064d36262417f`',
    );
    await queryRunner.query(
      'ALTER TABLE `groups` DROP FOREIGN KEY `FK_accb24ba8f4f213f33d08e2a20f`',
    );
    await queryRunner.query(
      'ALTER TABLE `groupMembers` DROP FOREIGN KEY `FK_08cacea15f2aef324f78fddebff`',
    );
    await queryRunner.query(
      'ALTER TABLE `groupMembers` DROP FOREIGN KEY `FK_707e2d7e186d11bf587210223ab`',
    );
    await queryRunner.query(
      'ALTER TABLE `keywordSearchResults` ADD CONSTRAINT `FK_d44e35f72fa79bf6da16b17cfa0` FOREIGN KEY (`keywordId`) REFERENCES `monitoredKeywords`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `groups` ADD CONSTRAINT `FK_accb24ba8f4f213f33d08e2a20f` FOREIGN KEY (`creatorId`) REFERENCES `authorizedUsers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `authorized_guilds_groups_groups` ADD CONSTRAINT `FK_4f0314f65ed92eb8af85779e46e` FOREIGN KEY (`groupsId`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `discordGuilds` ADD CONSTRAINT `FK_f1223a6e8875b1c2181de7dc031` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `linkPatterns` ADD CONSTRAINT `FK_b15952b02371c608d9bba4465e7` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `youTubeChannelIDs` ADD CONSTRAINT `FK_29badbc9883b266c7246c8b3224` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `youTubeVideoIDs` ADD CONSTRAINT `FK_520170be1b574d064d36262417f` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `groupMembers` ADD CONSTRAINT `FK_707e2d7e186d11bf587210223ab` FOREIGN KEY (`userId`) REFERENCES `authorizedUsers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `groupMembers` ADD CONSTRAINT `FK_08cacea15f2aef324f78fddebff` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }
}
