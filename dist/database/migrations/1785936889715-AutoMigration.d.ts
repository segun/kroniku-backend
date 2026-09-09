import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AutoMigration1785936889715 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
