import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { config } from "../config/config.js";

export const auth = async (req, res, next) => {
    if (!req.headers.authorization) {
        res.setHeader("Content-Type", "application/json");
        return res.status(401).json({ error: `Unauthorized - no llega token` });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, config.SECRET); // Decodificar el token
        console.log("Payload decodificado:", decoded);

        // Buscar el usuario en la base de datos
        const usuario = await User.findById(decoded.id);
        if (!usuario) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        req.user = usuario; // Asignar el usuario completo a req.user
        next();
    } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(401).json({ error: `${error.message}` });
    }
};
export const isAdmin = (req, res, next) => {
    console.log('Usuario logueado:', req.user);
    if (req.user && req.user.role == 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
};

export const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ error: 'Acceso denegado: se requiere ser un usuario registrado' });
};

