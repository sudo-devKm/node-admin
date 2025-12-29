import bcrypt from 'bcryptjs';
import { Role } from './role.entity';
import { BaseCommonEntity } from "@database/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'users' })
@Index("users_first_last_name_idx", ["first_name", "last_name"])
@Index("users_full_name_idx", ["full_name"])
export class User extends BaseCommonEntity {
    @Column()
    first_name!: string;

    @Column()
    last_name!: string;

    @Column({ select: false })
    password!: string;

    @Column({ unique: true })
    email!: string;

    @Column({
        type: 'varchar',
        asExpression: `CONCAT(first_name, ' ', last_name)`,
        generatedType: 'STORED',
        select: true,
    })
    full_name!: string;

    @Column({ type: 'varchar' })
    role_id!: string;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'role_id', referencedColumnName: 'id', foreignKeyConstraintName: 'user_role_id_idx' })
    role!: Role

    // this never called on update. this will only called on save and insert
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    // Compare a plain password with the hashed password
    async comparePassword(plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, this.password);
    }
}