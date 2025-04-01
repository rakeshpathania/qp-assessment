import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateBlacklistedTokens1743525532082 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "blacklisted_tokens",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "token",
                        type: "varchar",
                        length: "500",
                        isNullable: false
                    },
                    {
                        name: "user_id",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "expires_at",
                        type: "timestamp",
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                        isNullable: false
                    }
                ]
            }),
            true
        );

        // Create indexes for better query performance
        await queryRunner.createIndex(
            "blacklisted_tokens",
            new TableIndex({
                name: "idx_blacklisted_tokens_token",
                columnNames: ["token"]
            })
        );

        await queryRunner.createIndex(
            "blacklisted_tokens",
            new TableIndex({
                name: "idx_blacklisted_tokens_email",
                columnNames: ["user_id"]
            })
        );

        await queryRunner.createIndex(
            "blacklisted_tokens",
            new TableIndex({
                name: "idx_blacklisted_tokens_expires_at",
                columnNames: ["expires_at"]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("blacklisted_tokens", "idx_blacklisted_tokens_token");
        await queryRunner.dropIndex("blacklisted_tokens", "idx_blacklisted_tokens_email");
        await queryRunner.dropIndex("blacklisted_tokens", "idx_blacklisted_tokens_expires_at");

        await queryRunner.dropTable("blacklisted_tokens");
    }
}
