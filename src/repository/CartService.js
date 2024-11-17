import { CartDTO } from "../DTO/CartDTO.js";

export class CartService {
    constructor(dao) {
        this.dao = dao;
    }

    async getCartById(id) {
        const cart = await this.dao.getBy({ _id: id });
        if (cart) {
            return new CartDTO(cart);
        }
        return null; // Carrito no encontrado
    }

    async createCart() {
        const newCart = await this.dao.create({ products: [] });
        return new CartDTO(newCart);
    }

    async addProductToCart(cartId, product) {
        const updatedCart = await this.dao.addToCart(cartId, product);
        if (updatedCart) {
            return new CartDTO(updatedCart);
        }
        return null; // Carrito no encontrado o producto no agregado
    }

    async removeProductFromCart(cartId, productId) {
        const updatedCart = await this.dao.removeFromCart(cartId, productId);
        if (updatedCart) {
            return new CartDTO(updatedCart);
        }
        return null; // Carrito no encontrado o producto no eliminado
    }

    async deleteCartById(id) {
        return await this.dao.deleteById(id);
    }
}


