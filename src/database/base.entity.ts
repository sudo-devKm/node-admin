import { Column, PrimaryColumn } from "typeorm";

export abstract class BaseCommonEntity {
    @PrimaryColumn({ type: 'varchar', length: 36, default: '(UUID())', generated: "uuid" })
    id!: string;

    @Column({
        type: 'timestamp',
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
        transformer: {
            to: (value: Date) => value,
            from: (value: Date | string) => value ? new Date(value) : value,
        },
    })
    created_at!: Date;

    @Column({
        type: 'timestamp',
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        transformer: {
            to: (value: Date) => value,
            from: (value: Date | string) => value ? new Date(value) : value,
        },
    })
    updated_at!: Date;
}