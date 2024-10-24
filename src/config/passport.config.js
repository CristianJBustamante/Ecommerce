// /src/config/passport.config.js
import passport from "passport";
import local from "passport-local";
import passportJWT from "passport-jwt";
import { userModel } from "../dao/models/userModel.js";
import { generaHash, validaHash } from "../utils.js";
import { config } from "./config.js";

// Extractor personalizado para obtener el token de cookies
const buscarToken = req => {
    let token = null;
    if (req.cookies && req.cookies.jwtToken) { // Asegúrate de usar el nombre de tu cookie
        console.log(`passport recibe token...!!!`);
        token = req.cookies.jwtToken;
    }
    return token;
};

export const startPassport = () => {
    // Estrategia para el registro de nuevos usuarios
    passport.use(
        "registro",
        new local.Strategy(
            {
                passReqToCallback: true, // Permite pasar `req` a la función callback
                usernameField: "email"
            },
            async (req, username, password, done) => {
                try {
                    const { first_name, last_name, age } = req.body;

                    // Validar que no falten campos esenciales
                    if (!first_name || !last_name || !age) {
                        return done(null, false, { message: "Faltan campos requeridos." });
                    }

                    // Comprobar si el usuario ya existe
                    const existeUsuario = await userModel.findOne({ email: username });
                    if (existeUsuario) {
                        return done(null, false, { message: "El usuario ya existe." });
                    }

                    // Crear un nuevo usuario
                    const hashPassword = generaHash(password); // Encriptar la contraseña
                    const nuevoUsuario = await userModel.create({
                        first_name,
                        last_name,
                        email: username,
                        age,
                        password: hashPassword,
                    });

                    return done(null, nuevoUsuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Estrategia de login con local strategy
    passport.use(
        "login",
        new local.Strategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    const usuario = await userModel.findOne({ email: username });
                    if (!usuario) {
                        return done(null, false, { message: "Usuario no encontrado." });
                    }

                    // Validar la contraseña
                    const validPassword = validaHash(password, usuario.password);
                    if (!validPassword) {
                        return done(null, false, { message: "Contraseña incorrecta." });
                    }

                    // Eliminar la contraseña del objeto usuario antes de retornarlo
                    const userSinPassword = { ...usuario.toObject() };
                    delete userSinPassword.password;

                    return done(null, userSinPassword);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Estrategia JWT para usuarios logueados
    passport.use(
        "current",
        new passportJWT.Strategy(
            {
                secretOrKey: config.SECRET, // Clave secreta para firmar/verificar el token
                jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscarToken])
            },
            async (jwt_payload, done) => {
                try {
                    const usuario = await userModel.findById(jwt_payload.id);
                    if (!usuario) {
                        return done(null, false);
                    }

                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};
