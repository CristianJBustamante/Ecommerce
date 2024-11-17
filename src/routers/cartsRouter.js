import { Router } from 'express';
import { CartDAO } from "../dao/cartDAO.js"; // Importar el CartDAO
import { auth, isAdmin } from "../middleware/auth.js"; // Importar los middleware para autenticación y roles
import { CartDTO } from "../DTO/CartDTO.js"; // Asegúrate de tener el CartDTO para transformar los datos

const router = Router();
const cartDAO = new CartDAO(); // Instanciamos el CartDAO

// Ruta para obtener todos los carritos
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const carts = await cartDAO.get();
        const cartDTOs = carts.map(cart => new CartDTO(cart)); // Transformamos los carritos a DTO
        res.status(200).json(cartDTOs); // Enviamos la respuesta con los carritos
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
});

// Ruta para obtener un carrito por ID
router.get('/:id', auth, async (req, res) => {
    try {
        const cart = await cartDAO.getBy({ _id: req.params.id });
        if (cart) {
            const cartDTO = new CartDTO(cart); // Transformamos el carrito a DTO
            res.status(200).json(cartDTO); // Enviamos el carrito
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Ruta para crear un carrito nuevo
router.post('/', auth, async (req, res) => {
    try {
        const newCart = await cartDAO.create(req.body);
        const cartDTO = new CartDTO(newCart); // Transformamos el carrito creado a DTO
        res.status(201).json(cartDTO); // Enviamos la respuesta con el carrito creado
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// Ruta para actualizar un carrito
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedCart = await cartDAO.updateById(req.params.id, req.body);
        if (updatedCart) {
            const cartDTO = new CartDTO(updatedCart); // Transformamos el carrito actualizado a DTO
            res.status(200).json(cartDTO); // Enviamos el carrito actualizado
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});

// Ruta para eliminar un carrito
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedCart = await cartDAO.deleteById(req.params.id);
        if (deletedCart) {
            res.status(200).json({ message: 'Carrito eliminado correctamente' }); // Confirmación de eliminación
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
});

export {router};



