# Everything about the Spark18 Resto

## Challenges faced while Developing project

1. Decision of using typescript of Javascript. Decided Typescript and TypeORM as ORM to connect with Database.

## Ways in which the application can be improved in aspects of performance, structure or standards.

1. Just having single table for keeping the opening time value of the restaurants. Later, we can have this value splitted into two columns, (to and from) in another table.
2. We can have more modular structure i.e. Follow the concepts of SOLID principle(Single Responsibility, Open/Closed)
3. Have business logic and Delivery logic separated.
4. Write unit test cases for all the API's.
5. Validation of the `opening_hours` and `sale_time` field of Restaurant and ProductSale respectively.

### SOLID Principle in detail:

SRP keeps modules separated, OCP keeps code free of need for modifications, LSP and ISP make you use the basest of classes or interfaces, reinforcing the separation of modules, while DIP is helping you sharpen the boundaries between modules. Taken together, SOLID principles are obviously about focus, allowing you to work on small, manageable parts of the code without needing knowledge of others or having to make changes to them  

## Steps to run this project:

1. Git clone the project from the repository.
2. Install `postgres` in the Operating System.
3. Run `npm i` command after changing directory to that of the project.
4. Setup database settings inside `ormconfig.json` file
5. Create a env file with the required data. Take example from `.env.sample` file
6. Run `npm start` command
7. A `postman collection file` is also included in the Repository to get a glimpse of How each API is called.

## Assumptions

1. Update the value of keyname in `.env` file to the value of attribute 'name' present in the file field in the form. The `NAME` you use in multer's `upload.single(NAME)` function must be the same as the one you use in `<input type="file" name="<NAME>">`.
2. Price field in the Request body should be integer only. For ex. 100, 300.

3. The opening_hours field of the Request Body and sale_time field of the product field should be a string. 
For ex. `[['10:00', '16:00'],['10:00', '14: 00'],['10:00', '14: 00'],['10:00', '14: 00'],['10:00', '14: 00'],['10:00', '14: 00'],['10:00', '14: 00']],`. Here , first index tells the data for `Sunday`.
4. If product is not on sale, then the form field `sale` should be `false`.
5. If product is not on sale, then the form field `sale` should be `true` and must have the three fields `description`,`promotional_price` and `sale_time`.
6. For deleting a product from restaurant, we have to first retrieve the all products of a particular restaurant and then we have to note the `id` of the product which we want to delet and Do `DEL` Request over `localhost:3000/products/{id}`.
7. For updating a product of a restaurant, same as 6 and Do `PATCH` Request over `localhost:3000/products/{id}`.
