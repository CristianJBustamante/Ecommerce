import { Router } from "express";
import { ProductService } from "../repository/ProductService.js";
import { ProductDAO } from "../dao/productDAO.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = Router();
const productService = new ProductService(new ProductDAO());

// Obtener todos los productos
router.get("/", async (req, res) => {
    try {
        const products = await productService.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un producto por ID
router.get("/:pid", async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un producto (sólo admin)
router.post("/", auth, isAdmin, async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un producto por ID (sólo admin)
router.put("/:pid", auth, isAdmin, async (req, res) => {
    try {
        const updatedProduct = await productService.updateProductById(req.params.pid, req.body);
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: "Producto no encontrado o no actualizado" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un producto por ID (sólo admin)
router.delete("/:pid", auth, isAdmin, async (req, res) => {
    try {
        const deleted = await productService.deleteProductById(req.params.pid);
        if (deleted) {
            res.json({ message: "Producto eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { router };

