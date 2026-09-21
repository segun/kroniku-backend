"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpandSyncEventTitle1788950000000 = void 0;
class ExpandSyncEventTitle1788950000000 {
    name = 'ExpandSyncEventTitle1788950000000';
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE `sync_events` MODIFY `title` text NULL');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE `sync_events` MODIFY `title` varchar(255) NULL');
    }
}
exports.ExpandSyncEventTitle1788950000000 = ExpandSyncEventTitle1788950000000;
//# sourceMappingURL=1788950000000-ExpandSyncEventTitle.js.map