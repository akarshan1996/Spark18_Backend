import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Restaurant } from "../entity/Restaurant";
import { write, writeFile } from 'fs'
import * as path from 'path';
import { pick } from 'lodash';
var fs = require('fs');
require('dotenv').config();
var cloudinary = require('cloudinary').v2;

export class RestaurantController {

    private restaurantRepository = getRepository(Restaurant);

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const restaurants = await this.restaurantRepository.find();
            return response.status(200).json(restaurants);
        } catch (err) {
            response.status(400).json({ err: err.message });
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const restaurant = await this.restaurantRepository.findOne(request.params.id);
            if (!restaurant) {
                return response.status(404).json({ status: `Restaurant with id equals ${request.params.id} is not found` });
            }
            return response.status(200).json(restaurant);
        } catch (err) {
            response.status(400).json({ err: err.message });
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const restaurant = await this.restaurantRepository.findOne(request.params.id);
            if (!restaurant) {
                return response.status(404).json({ status: `Restaurant with id equals ${request.params.id} is not present` });
            }
            const { name = restaurant.name, address = restaurant.address, opening_hours = restaurant.opening_hours } = request.body;
            if (!request.file) {
                let newRestaurant = {};
                const dto = { name, address, opening_hours };
                newRestaurant = await this.restaurantRepository.update(request.params.id, dto);
                return response.status(200).json(newRestaurant);
            } else {
                const buf = Buffer.from(request.file.buffer as any, 'base64');
                const targetPathImage = path.join(process.cwd(), 'images', request.file.originalname);
                writeFile(targetPathImage, buf, (err) => {
                    if (err) throw err;
                    let newRestaurant = {};
                    console.log('Image saved to server successfully')
                    cloudinary.uploader.upload(targetPathImage, { tags: request.body.name })
                        .then(async (image) => {
                            console.log('Updation Phase: File uploaded to Cloudinary service');
                            const dto = {
                                photo: image.secure_url,
                                name,
                                address,
                                opening_hours,
                            };
                            newRestaurant = await this.restaurantRepository.update(request.params.id, dto);
                        })
                        .then(() => console.log('Restaurant updated successfully'))
                        .catch((err) => response.status(400).json({ err: err.message }))
                        .finally(() => response.status(200).json(newRestaurant));
                });
            }
        } catch (err) {
            response.status(400).json({ err: err.message });
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try {
            const buf = Buffer.from(request.file.buffer as any, 'base64');
            const targetPathImage = path.join(process.cwd(), 'images', request.file.originalname);
            writeFile(targetPathImage, buf, (err) => {
                if (err) throw err;
                let newRestaurant = {};
                console.log('Image saved to server successfully')
                cloudinary.uploader.upload(targetPathImage, { tags: request.body.name })
                    .then(async (image) => {
                        console.log('File uploaded to Cloudinary service');
                        let restaurantData = new Restaurant(pick(request.body, ['name', 'address', 'opening_hours']));
                        restaurantData.photo = image.secure_url
                        restaurantData.products = []
                        newRestaurant = await this.restaurantRepository.save(restaurantData);
                    })
                    .then(() => console.log('Photo saved to database successfully'))
                    .catch((err) => response.status(400).json({ err: err.message }))
                    .finally(() => response.status(201).json(newRestaurant));
            });
        } catch (err) {
            response.status(400).json({ err: err.message });
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            let restaurantToRemove = await this.restaurantRepository.findOne(request.params.id);
            if (!restaurantToRemove) {
                return response.status(404).json({ status: `Restaurant with id equals ${request.params.id} is not present, cannot be deleted` });
            }
            await this.restaurantRepository.remove(restaurantToRemove);
            return response.status(200).json({ status: `Restaurant with id equals ${request.params.id} is deleted successfully` });
        } catch (err) {
            response.status(400).json({ err: err.message });
        }
    }
}