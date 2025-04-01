import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { OrderItem } from "./orderItem.js"; 
import type { User } from "./user.js"; 

@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int" })
    userId!: number;

    @Column({ type: "float" })
    totalAmount!: number;

    @Column({ type: "varchar", default: "pending" })
    status!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orderItems!: OrderItem[];

    @ManyToOne("User", (user: User) => user.orders)
    @JoinColumn({ name: "user_id" })
    user!: User;
}
