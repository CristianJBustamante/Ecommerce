import {ProductDTO} from './ProductDTO.js';

export class CartDTO {
  constructor(cart) {
    this.id = cart._id;
    this.products = cart.products.map(item => ({
      product: new ProductDTO(item.product),
      quantity: item.quantity
    }));
  }
}

