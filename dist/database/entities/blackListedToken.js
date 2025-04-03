var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, BeforeInsert } from "typeorm";
let BlacklistedToken = class BlacklistedToken {
    id;
    token;
    userId;
    expiresAt;
    createdAt;
    updatedAt;
    setDates() {
        // Set expiresAt to 24 hours from now
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);
        this.expiresAt = expiryDate;
    }
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BlacklistedToken.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar" }),
    Index(),
    __metadata("design:type", String)
], BlacklistedToken.prototype, "token", void 0);
__decorate([
    Column({ type: "int" }),
    Index(),
    __metadata("design:type", Number)
], BlacklistedToken.prototype, "userId", void 0);
__decorate([
    Column({ type: "timestamp" }),
    Index(),
    __metadata("design:type", Date)
], BlacklistedToken.prototype, "expiresAt", void 0);
__decorate([
    CreateDateColumn({ name: "created_at" }),
    __metadata("design:type", Date)
], BlacklistedToken.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: "updated_at" }),
    __metadata("design:type", Date)
], BlacklistedToken.prototype, "updatedAt", void 0);
__decorate([
    BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BlacklistedToken.prototype, "setDates", null);
BlacklistedToken = __decorate([
    Entity("blacklisted_tokens")
], BlacklistedToken);
export { BlacklistedToken };
