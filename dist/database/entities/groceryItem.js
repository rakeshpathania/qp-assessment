var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { OrderItem } from "./orderItem.js";
let GroceryItem = class GroceryItem {
    id;
    name;
    price;
    quantityInStock;
    createdAt;
    updatedAt;
    orderItems;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], GroceryItem.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar" }),
    __metadata("design:type", String)
], GroceryItem.prototype, "name", void 0);
__decorate([
    Column({ type: "float" }),
    __metadata("design:type", Number)
], GroceryItem.prototype, "price", void 0);
__decorate([
    Column({ type: "int" }),
    __metadata("design:type", Number)
], GroceryItem.prototype, "quantityInStock", void 0);
__decorate([
    CreateDateColumn({ name: "created_at" }),
    __metadata("design:type", Date)
], GroceryItem.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: "updated_at" }),
    __metadata("design:type", Date)
], GroceryItem.prototype, "updatedAt", void 0);
__decorate([
    OneToMany(() => OrderItem, (orderItem) => orderItem.groceryItem),
    __metadata("design:type", Array)
], GroceryItem.prototype, "orderItems", void 0);
GroceryItem = __decorate([
    Entity("grocery_items")
], GroceryItem);
export { GroceryItem };
