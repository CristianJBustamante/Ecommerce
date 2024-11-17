import passport from "passport";
import local from "passport-local";
import passportJWT from "passport-jwt";
import { User } from "../models/userModel.js";
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
                    const existeUsuario = await User.findOne({ email: username });
                    if (existeUsuario) {
                        return done(null, false, { message: "El usuario ya existe." });
                    }

                    // Crear un nuevo usuario
                    const hashPassword = generaHash(password); // Encriptar la contraseña
                    const nuevoUsuario = await User.create({
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
                    const usuario = await User.findOne({ email: username });
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
                secretOrKey: config.SECRET,
                jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscarToken]),
            },
            async (jwt_payload, done) => {
                try {
                    console.log("JWT Payload recibido:", jwt_payload); // Para verificar el contenido del token
                    const usuario = await User.findById(jwt_payload.id); // Consulta a MongoDB
    
                    if (!usuario) {
                        console.log("Usuario no encontrado en la base de datos");
                        return done(null, false);
                    }
    
                    console.log("Usuario encontrado en la base de datos:", usuario); // Depuración
                    return done(null, usuario); // Pasa el usuario completo a req.user
                } catch (error) {
                    console.error("Error en la estrategia JWT:", error);
                    return done(error, false);
                }
            }
        )
    );
    
};
