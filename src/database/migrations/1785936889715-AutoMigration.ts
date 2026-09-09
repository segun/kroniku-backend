import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1785936889715 implements MigrationInterface {
    name = 'AutoMigration1785936889715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`passwordHash\` varchar(255) NOT NULL, \`retrievalOptIn\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`devices\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`clientDeviceId\` varchar(160) NOT NULL, \`platform\` varchar(80) NULL, \`appVersion\` varchar(120) NULL, \`publicKey\` text NULL, \`lastSeenAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_e8a5d59f0ac3040395f159507c\` (\`userId\`), UNIQUE INDEX \`IDX_ac9472fba91be2da8f1284cc84\` (\`userId\`, \`clientDeviceId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sync_conflicts\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`eventId\` varchar(80) NOT NULL, \`incomingDeviceId\` varchar(255) NULL, \`incomingVersion\` int NOT NULL, \`serverVersion\` int NOT NULL, \`strategy\` varchar(40) NOT NULL, \`incomingPayloadHash\` varchar(128) NULL, \`serverPayloadHash\` varchar(128) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_6a2b2912744a52251cd902b167\` (\`userId\`), INDEX \`IDX_b098a8e7d27cf4a25a4f40519c\` (\`eventId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sync_events\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`deviceId\` varchar(255) NULL, \`eventId\` varchar(80) NOT NULL, \`version\` int NOT NULL DEFAULT '1', \`occurredAt\` datetime NULL, \`source\` varchar(80) NULL, \`title\` varchar(255) NULL, \`detail\` text NULL, \`searchText\` text NULL, \`encryptedPayload\` text NOT NULL, \`payloadHash\` varchar(128) NOT NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_34231ff0eabeff25bfc9ad186f\` (\`userId\`), INDEX \`IDX_6cf28789ad0de894afb61647a3\` (\`deviceId\`), UNIQUE INDEX \`IDX_8d8ed489a4330cbbe8aa7c5384\` (\`userId\`, \`eventId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`devices\` ADD CONSTRAINT \`FK_e8a5d59f0ac3040395f159507c6\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sync_conflicts\` ADD CONSTRAINT \`FK_6a2b2912744a52251cd902b1674\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sync_conflicts\` ADD CONSTRAINT \`FK_2ab48650313e113f988894e8ebe\` FOREIGN KEY (\`incomingDeviceId\`) REFERENCES \`devices\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sync_events\` ADD CONSTRAINT \`FK_34231ff0eabeff25bfc9ad186f6\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sync_events\` ADD CONSTRAINT \`FK_6cf28789ad0de894afb61647a3e\` FOREIGN KEY (\`deviceId\`) REFERENCES \`devices\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sync_events\` DROP FOREIGN KEY \`FK_6cf28789ad0de894afb61647a3e\``);
        await queryRunner.query(`ALTER TABLE \`sync_events\` DROP FOREIGN KEY \`FK_34231ff0eabeff25bfc9ad186f6\``);
        await queryRunner.query(`ALTER TABLE \`sync_conflicts\` DROP FOREIGN KEY \`FK_2ab48650313e113f988894e8ebe\``);
        await queryRunner.query(`ALTER TABLE \`sync_conflicts\` DROP FOREIGN KEY \`FK_6a2b2912744a52251cd902b1674\``);
        await queryRunner.query(`ALTER TABLE \`devices\` DROP FOREIGN KEY \`FK_e8a5d59f0ac3040395f159507c6\``);
        await queryRunner.query(`DROP INDEX \`IDX_8d8ed489a4330cbbe8aa7c5384\` ON \`sync_events\``);
        await queryRunner.query(`DROP INDEX \`IDX_6cf28789ad0de894afb61647a3\` ON \`sync_events\``);
        await queryRunner.query(`DROP INDEX \`IDX_34231ff0eabeff25bfc9ad186f\` ON \`sync_events\``);
        await queryRunner.query(`DROP TABLE \`sync_events\``);
        await queryRunner.query(`DROP INDEX \`IDX_b098a8e7d27cf4a25a4f40519c\` ON \`sync_conflicts\``);
        await queryRunner.query(`DROP INDEX \`IDX_6a2b2912744a52251cd902b167\` ON \`sync_conflicts\``);
        await queryRunner.query(`DROP TABLE \`sync_conflicts\``);
        await queryRunner.query(`DROP INDEX \`IDX_ac9472fba91be2da8f1284cc84\` ON \`devices\``);
        await queryRunner.query(`DROP INDEX \`IDX_e8a5d59f0ac3040395f159507c\` ON \`devices\``);
        await queryRunner.query(`DROP TABLE \`devices\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
