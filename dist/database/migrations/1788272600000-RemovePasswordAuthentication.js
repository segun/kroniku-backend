"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemovePasswordAuthentication1788272600000 = void 0;
class RemovePasswordAuthentication1788272600000 {
    name = 'RemovePasswordAuthentication1788272600000';
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE `users` DROP COLUMN `passwordHash`');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE `users` ADD `passwordHash` varchar(255) NULL');
    }
}
exports.RemovePasswordAuthentication1788272600000 = RemovePasswordAuthentication1788272600000;
//# sourceMappingURL=1788272600000-RemovePasswordAuthentication.js.map