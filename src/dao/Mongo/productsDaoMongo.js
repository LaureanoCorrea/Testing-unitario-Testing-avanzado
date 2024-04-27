import productsModel from "./models/products.model.js";

class ProductDaoMongo {
  constructor() {
    this.productsModel = productsModel;
  }

  async getProductsPaginated(filter, options) {
    return await this.productsModel.paginate(filter, options);
  }
  
  async getProduct(pid) {
    return await this.productsModel.findOne({ _id: pid }).lean();
  }

  async createProducts(newProduct) {
    return await this.productsModel.create(newProduct);
  }

  async updateProduct(pid) {
    return await this.productsModel.updateOne({ _id: pid });
  }

  async deleteProduct(pid) {
    return await this.productsModel.deleteOne({ _id: pid });
  }
}
export default ProductDaoMongo;
