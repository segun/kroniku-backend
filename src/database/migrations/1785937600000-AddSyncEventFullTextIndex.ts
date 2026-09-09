import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSyncEventFullTextIndex1785937600000 implements MigrationInterface {
  name = 'AddSyncEventFullTextIndex1785937600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `sync_events` ADD FULLTEXT INDEX `IDX_sync_events_fulltext_projection` (`title`, `detail`, `searchText`, `source`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `sync_events` DROP INDEX `IDX_sync_events_fulltext_projection`',
    );
  }
}
