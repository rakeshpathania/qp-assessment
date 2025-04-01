import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, BeforeInsert } from "typeorm";

@Entity("blacklisted_tokens")
export class BlacklistedToken {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar"})
    @Index() 
    token!: string;

    @Column({ type: "int"})
    @Index() 
    userId!: number;

    @Column({ type: "timestamp" })
    @Index() 
    expiresAt!: Date;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @BeforeInsert()
    setDates() { 
        // Set expiresAt to 24 hours from now
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);
        this.expiresAt = expiryDate;
    }
}
