import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { RestaurantController } from "../controller/RestaurantController";
import { ProductSale } from "./ProductSale";
import { Restaurant } from "./Restaurant";

@Entity()
export class Product {

    constructor(props) {
        if (props) {
            console.log('inside constructor of product entity');
            this.photo = props.photo;
            this.name = props.name;
            this.price = props.price;
            this.category = props.category;
            this.sale = props.sale;
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    photo: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    category: string;

    @Column()
    sale: boolean;

    @ManyToOne(type => Restaurant, restro => restro.products) //owner side
    restro: Restaurant;

    @OneToOne(type => ProductSale, productSale => productSale.product, {
        cascade: true,
    })
    productSale: ProductSale;
}
