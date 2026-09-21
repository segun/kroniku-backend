"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserPreferences1788951000000 = void 0;
class AddUserPreferences1788951000000 {
    name = 'AddUserPreferences1788951000000';
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE `user_preferences` DROP FOREIGN KEY `FK_user_preferences_user`');
        await queryRunner.query('DROP TABLE `user_preferences`');
    }
}
exports.AddUserPreferences1788951000000 = AddUserPreferences1788951000000;
//# sourceMappingURL=1788951000000-AddUserPreferences.js.map