import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { connDB } from './connDB.js';
import { config } from './config/config.js';
import cookieParser from 'cookie-parser'; 
import passport from 'passport'; 
import { startPassport } from './config/passport.config.js'; 
import { router as sessionsRouter } from './routers/sessionsRouter.js';

const PORT = config.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize()); 

startPassport();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('OK');
});

// Rutas de sesiones
app.use("/api/sessions", sessionsRouter);

const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

connDB();
