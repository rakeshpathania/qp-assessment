import { Table, TableForeignKey } from "typeorm";
export class OrderItems1743434709630 {
    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: "order_items",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "order_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "grocery_item_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "quantity",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                },
            ],
        }));
        const tableExists = await queryRunner.hasTable("orders");
        if (tableExists) {
            await queryRunner.createForeignKeys("order_items", [
                new TableForeignKey({
                    columnNames: ["order_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "orders",
                    onDelete: "CASCADE",
                }),
                new TableForeignKey({
                    columnNames: ["grocery_item_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "grocery_items",
                    onDelete: "CASCADE",
                }),
            ]);
        }
    }
    async down(queryRunner) {
        await queryRunner.dropTable("order_items");
    }
}
