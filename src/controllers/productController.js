import ProductDAO from '../dao/productDAO.js';
import ProductDTO from '../DTO/ProductDTO.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductDAO.getAllProducts(); // Obtenemos todos los productos de la base de datos
    const productDTOs = products.map(product => new ProductDTO(product)); // Transformamos los productos usando el ProductDTO
    res.json(productDTOs); // Enviamos los productos transformados
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductDAO.getProductById(id); // Buscamos el producto por ID
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const productDTO = new ProductDTO(product); // Transformamos el producto usando el ProductDTO
    res.json(productDTO); // Enviamos el producto transformado
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

export const createProduct = async (req, res) => {
  const { title, description, price, thumbnail, stock } = req.body;
  try {
    const newProduct = await ProductDAO.createProduct({
      title, description, price, thumbnail, stock
    });
    const productDTO = new ProductDTO(newProduct); // Transformamos el producto usando el ProductDTO
    res.status(201).json(productDTO); // Enviamos el producto creado
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, thumbnail, stock } = req.body;
  try {
    const updatedProduct = await ProductDAO.updateProduct(id, {
      title, description, price, thumbnail, stock
    });
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const productDTO = new ProductDTO(updatedProduct); // Transformamos el producto usando el ProductDTO
    res.json(productDTO); // Enviamos el producto actualizado
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await ProductDAO.deleteProduct(id); // Eliminamos el producto por ID
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(204).json({ message: 'Producto eliminado correctamente' }); // Respondemos con éxito
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};
