import { ProductController } from "./controller/ProductController";
import { RestaurantController } from "./controller/RestaurantController";

export const Routes = [{
    method: "get",
    route: "/restaurants",
    controller: RestaurantController,
    action: "all"
}, {
    method: "get",
    route: "/restaurants/:id",
    controller: RestaurantController,
    action: "one"
}, {
    method: "post",
    route: "/restaurants",
    controller: RestaurantController,
    action: "save"
}, {
    method: "patch",
    route: "/restaurants/:id",
    controller: RestaurantController,
    action: "update"
},
{
    method: "delete",
    route: "/restaurants/:id",
    controller: RestaurantController,
    action: "remove"
}, {
    method: "get",
    route: "/restaurants/:restroId/products",
    controller: ProductController,
    action: "all"
}, {
    method: "post",
    route: "/restaurants/:restroId/products",
    controller: ProductController,
    action: "save"
}, {
    method: "patch",
    route: "/products/:productId",
    controller: ProductController,
    action: "update"
}, {
    method: "delete",
    route: "/products/:productId",
    controller: ProductController,
    action: "remove"
},
];