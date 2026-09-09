import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class RemovePasswordAuthentication1788272600000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
