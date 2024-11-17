import CartDAO from '../dao/cartDAO.js';
import CartDTO from '../DTO/CartDTO.js';

export const getAllCarts = async (req, res) => {
  try {
    const carts = await CartDAO.getAllCarts(); // Obtenemos todos los carritos de la base de datos
    const cartDTOs = carts.map(cart => new CartDTO(cart)); // Transformamos los carritos usando el CartDTO
    res.json(cartDTOs); // Enviamos los carritos transformados
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los carritos' });
  }
};

export const getCartById = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await CartDAO.getCartById(id); // Buscamos el carrito por ID
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    const cartDTO = new CartDTO(cart); // Transformamos el carrito usando el CartDTO
    res.json(cartDTO); // Enviamos el carrito transformado
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

export const createCart = async (req, res) => {
  try {
    const newCart = await CartDAO.createCart(); // Creamos un nuevo carrito
    const cartDTO = new CartDTO(newCart); // Transformamos el carrito usando el CartDTO
    res.status(201).json(cartDTO); // Enviamos el carrito creado
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
};

export const addProductToCart = async (req, res) => {
  const { cartId, productId, quantity } = req.body;
  try {
    const updatedCart = await CartDAO.addProductToCart(cartId, productId, quantity); // Agregamos el producto al carrito
    const cartDTO = new CartDTO(updatedCart); // Transformamos el carrito actualizado usando el CartDTO
    res.json(cartDTO); // Enviamos el carrito actualizado
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
};

export const deleteProductFromCart = async (req, res) => {
  const { cartId, productId } = req.params;
  try {
    const updatedCart = await CartDAO.deleteProductFromCart(cartId, productId); // Eliminamos el producto del carrito
    const cartDTO = new CartDTO(updatedCart); // Transformamos el carrito actualizado usando el CartDTO
    res.json(cartDTO); // Enviamos el carrito actualizado
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
};
