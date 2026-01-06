import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1767452593539 implements MigrationInterface {
    name = 'CreateProductsTable1767452593539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`permissions\` (\`id\` varchar(36) NOT NULL DEFAULT '(UUID())', \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` varchar(36) NOT NULL DEFAULT '(UUID())', \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`name\` varchar(255) NOT NULL, INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL DEFAULT '(UUID())', \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`full_name\` varchar(255) AS (CONCAT(first_name, ' ', last_name)) STORED NOT NULL, \`role_id\` varchar(255) NOT NULL, INDEX \`users_full_name_idx\` (\`full_name\`), INDEX \`users_first_last_name_idx\` (\`first_name\`, \`last_name\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`INSERT INTO \`app_db\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`, ["app_db","users","GENERATED_COLUMN","full_name","CONCAT(first_name, ' ', last_name)"]);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` varchar(36) NOT NULL DEFAULT '(UUID())', \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`image\` json NULL, \`price\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_permissions\` (\`permission_id\` varchar(36) NOT NULL, \`role_id\` varchar(36) NOT NULL, INDEX \`IDX_17022daf3f885f7d35423e9971\` (\`permission_id\`), INDEX \`IDX_178199805b901ccd220ab7740e\` (\`role_id\`), PRIMARY KEY (\`permission_id\`, \`role_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`user_role_id_idx\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_17022daf3f885f7d35423e9971e\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_178199805b901ccd220ab7740ec\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_178199805b901ccd220ab7740ec\``);
        await queryRunner.query(`ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_17022daf3f885f7d35423e9971e\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`user_role_id_idx\``);
        await queryRunner.query(`DROP INDEX \`IDX_178199805b901ccd220ab7740e\` ON \`role_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_17022daf3f885f7d35423e9971\` ON \`role_permissions\``);
        await queryRunner.query(`DROP TABLE \`role_permissions\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DELETE FROM \`app_db\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`, ["GENERATED_COLUMN","full_name","app_db","users"]);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`users_first_last_name_idx\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`users_full_name_idx\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`permissions\``);
    }

}
