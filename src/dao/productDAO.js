import { Product } from "../models/productsModel.js";

export class ProductDAO {
    async get() {
        return await Product.find();
    }

    async getBy(filter) {
        return await Product.findOne(filter);
    }

    async create(data) {
        return await Product.create(data);
    }

    async updateById(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteById(id) {
        return await Product.findByIdAndDelete(id);
    }
}


