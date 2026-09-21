import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpandSyncEventTitle1788950000000 implements MigrationInterface {
  name = 'ExpandSyncEventTitle1788950000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `sync_events` MODIFY `title` text NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `sync_events` MODIFY `title` varchar(255) NULL',
    );
  }
}