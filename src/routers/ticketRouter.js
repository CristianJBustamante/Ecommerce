import { Router } from "express";
import { TicketService } from "../repository/TicketService.js";
import { TicketDAO } from "../dao/ticketDAO.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = Router();
const ticketService = new TicketService(new TicketDAO());

// Obtener todos los tickets (sólo admin)
router.get("/", auth, isAdmin, async (req, res) => {
    try {
        const tickets = await ticketService.getTickets();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un ticket por ID
router.get("/:tid", auth, async (req, res) => {
    try {
        const ticket = await ticketService.getTicketById(req.params.tid);
        if (ticket) {
            res.json(ticket);
        } else {
            res.status(404).json({ error: "Ticket no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un ticket (generalmente ocurre al finalizar una compra)
router.post("/", auth, async (req, res) => {
    try {
        const ticket = await ticketService.createTicket(req.body);
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { router };
