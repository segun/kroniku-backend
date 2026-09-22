import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNamedPlaces1788952000000 implements MigrationInterface {
  name = 'AddNamedPlaces1788952000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`named_places\` (
        \`id\` varchar(36) NOT NULL,
        \`userId\` varchar(36) NOT NULL,
        \`name\` varchar(160) NOT NULL,
        \`latitude\` double NOT NULL,
        \`longitude\` double NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_named_places_userId\` (\`userId\`),
        CONSTRAINT \`FK_named_places_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `named_places` DROP FOREIGN KEY `FK_named_places_user`');
    await queryRunner.query('DROP TABLE `named_places`');
  }
}
