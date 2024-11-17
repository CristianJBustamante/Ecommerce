import { ProductDTO } from "../DTO/ProductDTO.js";

export class ProductService {
    constructor(dao) {
        this.dao = dao;
    }

    async getProducts() {
        const products = await this.dao.get();
        return products.map(product => new ProductDTO(product));
    }

    async getProductById(id) {
        const product = await this.dao.getBy({ _id: id });
        if (product) {
            return new ProductDTO(product);
        }
        return null; // Producto no encontrado
    }

    async createProduct(data) {
        const newProduct = await this.dao.create(data);
        return new ProductDTO(newProduct);
    }

    async updateProductById(id, data) {
        const updatedProduct = await this.dao.updateById(id, data);
        if (updatedProduct) {
            return new ProductDTO(updatedProduct);
        }
        return null; // Producto no encontrado o no actualizado
    }

    async deleteProductById(id) {
        return await this.dao.deleteById(id);
    }
}

