import usersModel from "./models/users.model.js";

class UserDaoMongo {
  constructor() {
    this.usersModel = usersModel;
  }

  async getUsers() {
    return await this.usersModel.find({});
  }

  async getUser(filter) {
    return await this.usersModel.findOne(filter);
  }

  async getUserBy(query) {
    return await this.usersModel.findOne(query);
  }

  async createUser(newUser) {
    return await this.usersModel.create(newUser);
  }

  async updateUser(uid, userToUpdate) {
    return await this.usersModel.updateOne({ _id: uid }, userToUpdate, {
      new: true,
    });
  }

  async deleteUser(uid) {
    return await this.usersModel.deleteOne({ _id: uid });
  }

  async updateUserCart(userId, cid) {
    return await this.usersModel.findByIdAndUpdate(
      userId,
      { cart: cid },
      { new: true }
    );
  }
}

export default UserDaoMongo;
