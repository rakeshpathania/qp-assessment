var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
let OrderItem = class OrderItem {
    id;
    order;
    groceryItem;
    quantity;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], OrderItem.prototype, "id", void 0);
__decorate([
    ManyToOne("Order", (order) => order.orderItems),
    JoinColumn({ name: "order_id" }),
    __metadata("design:type", Function)
], OrderItem.prototype, "order", void 0);
__decorate([
    ManyToOne("GroceryItem", (groceryItem) => groceryItem.orderItems),
    JoinColumn({ name: "grocery_item_id" }),
    __metadata("design:type", Function)
], OrderItem.prototype, "groceryItem", void 0);
__decorate([
    Column({ type: "int" }),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    CreateDateColumn({ name: "created_at" }),
    __metadata("design:type", Date)
], OrderItem.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: "updated_at" }),
    __metadata("design:type", Date)
], OrderItem.prototype, "updatedAt", void 0);
OrderItem = __decorate([
    Entity("order_items")
], OrderItem);
export { OrderItem };
