import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePasswordAuthentication1788272600000 implements MigrationInterface {
  name = 'RemovePasswordAuthentication1788272600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `passwordHash`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` ADD `passwordHash` varchar(255) NULL');
  }
}