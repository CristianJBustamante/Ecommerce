import { cartsModel } from '../models/cartsModel.js';
import {ProductDAO} from './productDAO.js'; // Importamos el ProductDAO correctamente

export class CartDAO {
  // Obtener todos los carritos
  async getAllCarts() {
    try {
      return await cartsModel.find(); // Obtiene todos los carritos
    } catch (error) {
      throw new Error('Error al obtener carritos');
    }
  }

  // Obtener un carrito por ID
  async getCartById(cid) {
    try {
      return await cartsModel.findById(cid).populate('products.product'); // Populate para traer los detalles de los productos
    } catch (error) {
      throw new Error('Error al obtener carrito');
    }
  }

  // Crear un nuevo carrito
  async createCart() {
    try {
      const newCart = new cartsModel({ products: [] }); // Creamos un carrito vacío
      return await newCart.save(); // Guardamos el carrito en la base de datos
    } catch (error) {
      throw new Error('Error al crear carrito');
    }
  }

  // Agregar producto al carrito
  async addProductToCart(cid, pid, quantity) {
    try {
      // Obtenemos el producto a partir del ProductDAO
      const product = await ProductDAO.getProductById(pid);
      if (!product) throw new Error('Producto no encontrado');
      if (product.stock < quantity) throw new Error('Stock insuficiente');

      // Obtenemos el carrito
      const cart = await cartsModel.findById(cid);
      const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

      // Si el producto no está en el carrito, lo agregamos
      if (productIndex === -1) {
        cart.products.push({ product: pid, quantity });
      } else {
        // Si ya está, solo actualizamos la cantidad
        cart.products[productIndex].quantity += quantity;
      }

      await cart.save(); // Guardamos los cambios
      return cart;
    } catch (error) {
      throw new Error('Error al agregar producto al carrito');
    }
  }

  // Finalizar compra
  async purchaseCart(cid) {
    try {
      // Obtenemos el carrito con los productos
      const cart = await cartsModel.findById(cid).populate('products.product');
      let failedProducts = [];

      // Recorremos los productos del carrito para verificar stock y actualizar
      for (let item of cart.products) {
        const product = item.product;
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
        } else {
          failedProducts.push(product._id); // Si el stock no es suficiente, lo agregamos a failedProducts
        }
      }

      // Filtramos los productos que no se pudieron comprar
      cart.products = cart.products.filter(item => !failedProducts.includes(item.product._id));
      await cart.save(); // Guardamos el carrito después de la compra

      return { cart, failedProducts }; // Devolvemos el carrito y los productos que fallaron
    } catch (error) {
      throw new Error('Error al finalizar compra');
    }
  }
}


