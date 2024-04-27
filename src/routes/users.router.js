// users.router.js
import { Router } from "express";
import UserController from "../controllers/users.controller.js";

const router = Router();
const userController = new UserController();

router.get("/", userController.getUsers);

router.post("/", userController.createUser);

router.get("/:uid", userController.getUserById);

router.put("/:uid", userController.updateUser);

router.delete("/:uid", userController.deleteUser);

export default router;
