import { Router } from "express";
import UserDaoMongo from "../dao/Mongo/userDaoMongo.js";
import { passportCall } from "../middleware/passportCall.js";
import authorization from "../middleware/authentication.middleware.js";
import CartDaoMongo from "../dao/Mongo/cartsDaoMongo.js";
import ProductDaoMongo from "../dao/Mongo/productsDaoMongo.js";

const router = Router();
const userService = new UserDaoMongo();
const cartService = new CartDaoMongo();
const productService = new ProductDaoMongo();

router.get("/", (req, res) => {
  res.render("login", {
    style: "index.css",
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    style: "index.css",
  });
});

router.get("/register", (req, res) => {
  res.render("register", {
    style: "index.css",
  });
});

router.get("/cart", passportCall(["jwt", "github"]), async (req, res) => {
  try {
    const cid = req.user.cart; // Obtener el ID del usuario en lugar del ID del carrito
    const cart = await cartService.getCartByIdLean(cid);

    const username = req.user.first_name;
    const role = req.user.role;

    res.render("cart", {
      cid,
      cart,
      username,
      role,
      style: "index.css",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/chat", (req, res) => {
  res.render("chat", {
    style: "index.css",
  });
});

router.get(
  "/products",
  passportCall(["jwt", "github"]),
  authorization(["admin", "user"]),
  async (req, res) => {
    const { limit = 10, page = 1, sort = "", query = "" } = req.query;

    try {
      const options = {
        limit,
        page,
        sort: sort || {},
        query,
        lean: true,
      };

      // Obtener el CID del token JWT
      const cid = req.user.cart;

      // Utilizar el ID del carrito para realizar operaciones relacionadas con el carrito
      const cart = await cartService.getCartById(cid);

      const {
        docs,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        page: currentPage,
      } = await productService.getProductsPaginated({}, options);

      const user = req.user;

      let username = req.user.first_name;
      const role = user ? user.role : "";

      res.render("products", {
        username,
        role,
        cid,
        products: docs,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        page: currentPage,
        userId: req.user.id,
        style: "index.css",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }
);

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productService.getProduct({});
    res.render("realTimeProducts", {
      productos: products,
      style: "index.css",
    });
  } catch (error) {
    console.log(error);
    res.json("Error al intentar obtener la lista de productos!");
    return;
  }
});

router.get(
  "/productDetails/:pid",
  passportCall(["jwt", "github"]),
  async (req, res) => {
    const { pid } = req.params;
    try {
      const product = await productService.getProduct(pid);

      const user = req.user;
      let username = req.user.first_name;
      const role = user ? user.role : "";

      const cid = req.user.cart;

      res.render("productDetails", {
        username,
        role,
        cid,
        userId: req.user.id,
        product,
        style: "index.css",
      });
    } catch (error) {
      console.log(error);
      res.json("Error al intentar obtener el producto!");
      return;
    }
  }
);

router.get(
  "/product-added/:pid",
  passportCall(["jwt", "github"]),
  
  async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await productService.getProduct(pid);

      const username = req.user.first_name;
      const role = req.user.role;

      res.render("product-added", {
        username,
        role,
        product,
        style: "index.css",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }
);


export default router;
