import { User } from "./user.entity";
import { BaseCommonEntity } from "@database/base.entity";
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { Permission } from "./permission.entity";

@Entity({ name: 'roles' })
@Index(["name"])
export class Role extends BaseCommonEntity {
    @Column()
    name!: string;

    @OneToMany(() => User, (user) => user.role)
    @JoinColumn({ name: 'id' })
    users!: User[];

    @ManyToMany(() => Permission)
    @JoinTable({
        name: 'role_permissions',
        joinColumn: { name: 'role_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' }
    })
    permissions!: Permission[];
}