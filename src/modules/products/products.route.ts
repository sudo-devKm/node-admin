import { AppRoute } from "@app/types";
import { Router } from "express";

export class ProductsRoute implements AppRoute {
    readonly router = Router();
    readonly path = '/products';

    constructor() {
        this.setProductsRoutes()
    };

    private readonly setProductsRoutes = () => {

    };
}