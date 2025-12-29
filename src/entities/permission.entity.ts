import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { BaseCommonEntity } from "@database/base.entity";
import { Role } from "./role.entity";

@Entity({ name: 'permissions' })
export class Permission extends BaseCommonEntity {
    @Column()
    name!: string;

    @ManyToMany(() => Role)
    @JoinTable({
        name: 'role_permissions',
        joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
    })
    roles!: Role[]
}