import ProductDaoMongo from "../dao/Mongo/productsDaoMongo.js";

class ProductController {
  constructor() {
    this.productService = new ProductDaoMongo();
  }

  getProducts = async (req, res) => {
    try {
      const { limit = 10, page = 1, sort = '', query = '' } = req.query;
      const options = {
          limit: parseInt(limit), 
          page: parseInt(page),   
          lean: true              
      };
  
      if (sort === 'asc' || sort === 'desc') {
          options.sort = { price: sort === 'asc' ? 1 : -1 };
      }
  
      const products = await this.productService.getProductsPaginated({}, options);
  
      const response = {
          status: 'success',
          payload: products.docs,     
          totalPages: products.totalPages,
          prevPage: products.prevPage,
          nextPage: products.nextPage,
          page: products.page,
          hasPrevPage: products.hasPrevPage,
          hasNextPage: products.hasNextPage,
          prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
          nextLink: products.hasNextPage ? `/products?page=${products.nextPage}` : null
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({
          status: 'error',
          message: 'Error interno del servidor'
      });
    }
  };
  
  getProductDetails = async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await this.productService.getProduct(pid);

      if (!product) {
          return res.status(404).json({
              status: 'error',
              message: 'Producto no encontrado'
          });
      }

      res.render('productDetails', { product });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          status: 'error',
          message: 'Error interno del servidor'
      });
  }
  };

  createProduct = async (req, res) => {
    try {
      const { title, description, price, thumbnail, code, stock, status, category } = req.body;
      const newProduct = { 
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          status,
          category
      }
      const result = await this.productService.createProducts(newProduct)

      res.status(201).send({
          status: "success",
          message: `El producto de nombre ${newProduct.title} con código ${newProduct.code} ha sido agregado exitosamente`,
          result: result
      });
  } catch (error) {
      console.error('Error al agregar producto', error)
      res.status(500).send({
          status: 'error',
          message: 'Error interno al agregar producto'
      })
  }
  };

  updateProduct = async (req, res) => {
    try {
      const { pid } = req.params
      const productToUpdate = req.body

      const result = await this.productService.updateProduct(pid, productToUpdate)

      res.status(200).send({
          status: 'succes',
          message: `El producto ${productToUpdate.title} con código ${productToUpdate.code} ha sido actualizado`,
          result: result
      })
  } catch (error) {
      console.error('Error al intentar actualizar el producto', error)
      res.status(500).send({
          status: 'error',
          message: 'Error interno al actualizar el producto'
      })
  }
  };

  deleteProduct = async (req, res) => {
    try {
      const { pid } = req.params
      const deleteProduct = await this.productService.deleteProduct(pid)

      if (!deleteProduct) {
          return res.status(400).send({
              status: 'Error',
              message: `El producto cuyo ID es "${pid}" no existe dentro del catálogo`,
              deleteProduct
          })
      }

      return res.status(200).send({
          status: 'succes',
          message: `El producto ${deleteProduct.title} de ID "${pid}" ha sido eliminado`,
      })

  } catch (error) {
      console.error('Error al intentar eliminar el producto:', error);
      res.status(500).send({
          status: error,
          message: 'Error interno al intentar eliminar el producto'
      });
  }
  };
}

export default ProductController;
