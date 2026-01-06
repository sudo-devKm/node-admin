import { BaseCommonEntity } from "@app/database/base.entity";
import { Column, Entity, Index } from "typeorm";

export interface ProductImageMeta {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
    size?: number;
    mimeType?: string;
    [key: string]: any;
}

@Entity({ name: 'products' })
@Index("products_title_idx", ['title'])
export class Product extends BaseCommonEntity {
    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column({ type: 'json', nullable: true })
    image?: ProductImageMeta;

    @Column()
    price!: number;
}