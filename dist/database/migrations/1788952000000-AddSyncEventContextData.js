"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSyncEventContextData1788952000000 = void 0;
class AddSyncEventContextData1788952000000 {
    name = 'AddSyncEventContextData1788952000000';
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE `sync_events` ADD `contextData` json NULL');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE `sync_events` DROP COLUMN `contextData`');
    }
}
exports.AddSyncEventContextData1788952000000 = AddSyncEventContextData1788952000000;
//# sourceMappingURL=1788952000000-AddSyncEventContextData.js.map