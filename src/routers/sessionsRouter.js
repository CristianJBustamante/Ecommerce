import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const router = Router();

// Ruta para registrar nuevos usuarios
router.post('/register', passport.authenticate('registro', { session: false }), (req, res) => {
    res.json({ message: "Usuario registrado exitosamente", user: req.user });
});

// Ruta para login
router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, config.SECRET, { expiresIn: '1h' });

    res.cookie('jwtToken', token, { httpOnly: true }).json({
        message: "Login exitoso",
        token,
    });
});

// Ruta para obtener el usuario logueado
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.json({ user: req.user });
});