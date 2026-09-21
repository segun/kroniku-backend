import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPreferences1788951000000 implements MigrationInterface {
  name = 'AddUserPreferences1788951000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`user_preferences\` (
        \`userId\` varchar(36) NOT NULL,
        \`morningStartMinutes\` int NOT NULL DEFAULT 360,
        \`afternoonStartMinutes\` int NOT NULL DEFAULT 720,
        \`earlyEveningStartMinutes\` int NOT NULL DEFAULT 960,
        \`nightStartMinutes\` int NOT NULL DEFAULT 1260,
        \`timezoneIdentifier\` varchar(120) NULL,
        \`schemaVersion\` int NOT NULL DEFAULT 1,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`userId\`),
        CONSTRAINT \`FK_user_preferences_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user_preferences` DROP FOREIGN KEY `FK_user_preferences_user`',
    );
    await queryRunner.query('DROP TABLE `user_preferences`');
  }
}
