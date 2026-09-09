"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSyncEventFullTextIndex1785937600000 = void 0;
class AddSyncEventFullTextIndex1785937600000 {
    name = 'AddSyncEventFullTextIndex1785937600000';
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE `sync_events` ADD FULLTEXT INDEX `IDX_sync_events_fulltext_projection` (`title`, `detail`, `searchText`, `source`)');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE `sync_events` DROP INDEX `IDX_sync_events_fulltext_projection`');
    }
}
exports.AddSyncEventFullTextIndex1785937600000 = AddSyncEventFullTextIndex1785937600000;
//# sourceMappingURL=1785937600000-AddSyncEventFullTextIndex.js.map