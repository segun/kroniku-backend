import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSyncEventContextData1788952000000 implements MigrationInterface {
  name = 'AddSyncEventContextData1788952000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `sync_events` ADD `contextData` json NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `sync_events` DROP COLUMN `contextData`',
    );
  }
}
