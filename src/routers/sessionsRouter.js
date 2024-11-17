import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { auth } from '../middleware/auth.js';
import { UserDTO } from "../DTO/UsersDTO.js";

export const router = Router();

// Ruta para registrar nuevos usuarios
router.post('/register', passport.authenticate('registro', { session: false }), (req, res) => {
    res.json({ message: "Usuario registrado exitosamente", user: req.user });
});

// Ruta para login
router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, config.SECRET, { expiresIn: '12h' });

    res.cookie('jwtToken', token, { httpOnly: true }).json({
        message: "Login exitoso",
        token,
    });
});

// Ruta para obtener el usuario logueado
router.get('/current', auth, (req, res) => {
    try {
        // console.log("Usuario autenticado:", req.user);
        const userDTO = new UserDTO(req.user); 
        res.status(200).json(userDTO); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener datos del usuario' });
    }
});