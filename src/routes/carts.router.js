import { Router } from "express";
import { passportCall } from "../middleware/passportCall.js";
import CartController from "../controllers/carts.controller.js";

const cartsRouter = Router();
const cartController = new CartController();

cartsRouter.post("/", (req, res) => cartController.createCart(req, res));

cartsRouter.post("/add", passportCall(['jwt', 'github']), (req, res) => cartController.addToCart(req, res));

cartsRouter.get("/cart", passportCall(['jwt', 'github']), (req, res) => cartController.getCart(req, res));

cartsRouter.put("/:pid", passportCall(['jwt', 'github']), (req, res) => cartController.updateCart(req, res));

cartsRouter.delete('/errase/:pid', passportCall(['jwt', 'github']), (req, res) => cartController.removeFromCart(req, res));

cartsRouter.delete('/vaciar', passportCall(['jwt', 'github']), (req, res) => cartController.removeAllFromCart(req, res));

export default cartsRouter;
