import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { OrderItem } from "./orderItem.js"; 

@Entity("grocery_items")
export class GroceryItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar" })
    name!: string;

    @Column({ type: "float" })
    price!: number;

    @Column({ type: "int" })
    quantityInStock!: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.groceryItem)
    orderItems!: OrderItem[];
}
