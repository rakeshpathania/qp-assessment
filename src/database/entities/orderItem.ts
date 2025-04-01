import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import type { Order } from "./order.js";
import type { GroceryItem } from "./groceryItem.js";

@Entity("order_items")
export class OrderItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne("Order", (order: Order) => order.orderItems)
    @JoinColumn({ name: "order_id" })
    order!: Order;
    
    @ManyToOne("GroceryItem", (groceryItem: GroceryItem) => groceryItem.orderItems)
    @JoinColumn({ name: "grocery_item_id" })
    groceryItem!: GroceryItem;

    @Column({ type: "int" })
    quantity!: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
}
