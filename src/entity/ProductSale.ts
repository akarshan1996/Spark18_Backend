import { type } from "os";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
export class ProductSale {

    constructor(props) {
        if (props) {
            this.description = props.description;
            this.promotional_price = props.promotional_price;
            this.sale_time = props.sale_time;
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    promotional_price: number;

    @Column()
    sale_time: string;            //must

    @OneToOne(type => Product, product => product.productSale)
    @JoinColumn()
    product: Product;
}
