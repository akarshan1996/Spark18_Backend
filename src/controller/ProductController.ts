import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Product } from "../entity/Product";
import { ProductSale } from "../entity/ProductSale";
import { writeFile } from 'fs'
import { Restaurant } from "../entity/Restaurant";
import * as path from 'path';
import { pick } from 'lodash';
import multer = require("multer");
import { RestaurantController } from "./RestaurantController";
var fs = require('fs');
require('dotenv').config();
var cloudinary = require('cloudinary').v2;


export class ProductController {

    private productRepository = getRepository(Product);
    private productSaleRepository = getRepository(ProductSale);
    private restaurantRepository = getRepository(Restaurant);

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const products = await this.productRepository.find({
                where: { restro: request.params.restroId },
                relations: ['productSale'],
            });
            if (!products) {
                response.status(404).json({ status: `There is no product present in the Restaurant having id equals ${request.params.id}` });
            }
            return response.status(200).json(products);
        } catch (err) {
            response.status(400).json({ err: err.message });
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            let newProduct = {}, newProductSale = {};
            const product = await this.productRepository.findOne({
                where: { id: request.params.productId },
                relations: ['productSale'],
            }) as (Product & ProductSale);
            if (!product) {
                return response.status(404).json({ status: `There is no product with id equals ${request.params.productId} present.` });
            }

            const { description = product.description, promotional_price = product.promotional_price, sale_time = product.sale_time } = request.body;
            if (request.body.sale === "true") {                 //If want to add the Product Sale Data
                let saleDto = { description, promotional_price, sale_time }
                product.sale = true;
                if (product.productSale === null) {         //If Product sale data is not existing already
                    let productSale = new ProductSale(pick(request.body, ['description', 'promotional_price', 'sale_time']));
                    product.productSale = productSale;
                    newProduct = await this.productRepository.save(product);

                } else {                //If product sale data exists then update it
                    newProductSale = await this.productSaleRepository.update({ id: product.productSale.id }, saleDto);
                }

            } else if (request.body.sale === "false") {         //If want to remove the Product Sale Data
                if (product.productSale !== null) {             //If already the Product Sale data is not present.
                    let productSaleToRemove = await this.productSaleRepository.findOne({ id: product.productSale.id });
                    if (productSaleToRemove) {
                        await this.productSaleRepository.remove(productSaleToRemove);
                    }
                }
            }
            const { name = product.name, price = product.price, category = product.category, sale = product.sale } = request.body;
            let dataToUpdate = { name, price, category, sale: sale == 'true' };

            if (!request.file) {            //If file is not present while changing the existing product 
                newProduct = await this.productRepository.update({ id: parseInt(request.params.productId) }, dataToUpdate);
                return response.status(200).json(newProduct);
            } else {                        //If file is present while changing the existing product 
                const base64 = Buffer.from(request.file.buffer as any, 'base64');
                const targetPathImage = path.join(process.cwd(), 'images', request.file.originalname);
                writeFile(targetPathImage, base64, (err) => {
                    if (err) throw err;
                    console.log('Image saved to server successfully')
                    cloudinary.uploader.upload(targetPathImage, { tags: request.body.name })
                        .then(async (image) => {
                            console.log('Updation Phase: File uploaded to Cloudinary service');
                            let dto = {
                                ...dataToUpdate,
                                photo: image.secure_url,
                            };
                            newProduct = await this.productRepository.update({ id: parseInt(request.params.productId) }, dto);
                            return response.status(200).json(newProduct);
                        })
                        .then(() => console.log('Product and Product Sale data updated successfully'))
                        .catch((err) => response.status(400).json({ err: err.message }))
                        .finally(() => response.status(200).json(newProduct));
                });
            }
        } catch (err) {
            response.status(400).json({ err: err.message });
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try {
            const restaurant = await this.restaurantRepository.findOne(request.params.id);
            if (!restaurant) {
                return response.status(404).json({ status: `Restaurant with id equals ${request.params.id} is not found` });
            }
            const buf = Buffer.from(request.file.buffer as any, 'base64');
            const targetPathImage = path.join(process.cwd(), 'images', request.file.originalname);
            writeFile(targetPathImage, buf, (err) => {
                if (err) throw err;
                let newProduct = {};
                console.log('Image saved to server successfully')
                cloudinary.uploader.upload(targetPathImage, { tags: request.body.name })
                    .then(async (image) => {
                        console.log('File uploaded to Cloudinary service');
                        let product = new Product(pick(request.body, ['name', 'price', 'category', 'sale']));
                        product.photo = image.secure_url;
                        product.restro = restaurant;
                        if (request.body.sale == 'true') {
                            let productSale = new ProductSale(pick(request.body, ['description', 'promotional_price', 'sale_time']));
                            product.productSale = productSale;
                        }
                        newProduct = await this.productRepository.save(product);
                    })
                    .then(() => console.log('Photo saved to database successfully'))
                    .catch((err) => response.status(400).json({ err: err.message }))
                    .finally(() => { response.status(201).json(newProduct); });
            });
        } catch (err) {
            response.status(400).json({ err: err.message });
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            let productToRemove = await this.productRepository.findOne({
                where: { id: request.params.productId },
                relations: ['productSale'],
            });
            console.log(productToRemove);
            if (!productToRemove) {
                return response.status(404).json({ status: `Product with id equals ${request.params.productId} is not present, cannot be deleted` });
            }
            await this.productRepository.remove(productToRemove);
            if (productToRemove.productSale !== null) {
                await this.productSaleRepository.remove(productToRemove.productSale);
            }
            return response.status(200).json({ status: `Product with id equals ${request.params.productId} is deleted successfully` });
        } catch (err) {
            response.status(400).json({ err: err.message });
        }
    }
}
