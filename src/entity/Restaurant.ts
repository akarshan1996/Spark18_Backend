import { type } from "os";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Restaurant {

    constructor(props) {
        if (props) {
            this.photo = props.photo;
            this.name = props.name;
            this.address = props.address;
            this.opening_hours = props.opening_hours;
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    photo: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    opening_hours: string;            //must

    @OneToMany(type => Product, product => product.restro, {
        cascade: true,
    })
    products: Product[]; //relation one to many
}
