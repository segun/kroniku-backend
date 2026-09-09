import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderIdentities1788271600000 implements MigrationInterface {
  name = 'AddProviderIdentities1788271600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` MODIFY `passwordHash` varchar(255) NULL');
    await queryRunner.query(
      'CREATE TABLE `auth_identities` (`id` varchar(36) NOT NULL, `userId` varchar(36) NOT NULL, `provider` varchar(20) NOT NULL, `providerSubject` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX `IDX_auth_identities_user_id` (`userId`), UNIQUE INDEX `IDX_auth_identities_provider_subject` (`provider`, `providerSubject`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `auth_identities` ADD CONSTRAINT `FK_auth_identities_user_id` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `auth_identities` DROP FOREIGN KEY `FK_auth_identities_user_id`',
    );
    await queryRunner.query('DROP INDEX `IDX_auth_identities_provider_subject` ON `auth_identities`');
    await queryRunner.query('DROP INDEX `IDX_auth_identities_user_id` ON `auth_identities`');
    await queryRunner.query('DROP TABLE `auth_identities`');
    await queryRunner.query('ALTER TABLE `users` MODIFY `passwordHash` varchar(255) NOT NULL');
  }
}
