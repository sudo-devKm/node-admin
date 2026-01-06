import { NextFunction, Request } from "express";

class ProductsController {

    constructor() { }

    readonly getProductById = async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (err) {
            return next(err);
        }
    }
};

export default new ProductsController();