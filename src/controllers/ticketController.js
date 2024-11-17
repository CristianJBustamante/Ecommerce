import TicketDAO from '../dao/ticketDAO.js';
import TicketDTO from '../DTO/TicketDTO.js';

export const createTicket = async (req, res) => {
  const { cartId, amount, purchaser } = req.body;
  try {
    const newTicket = await TicketDAO.createTicket({
      cartId, amount, purchaser
    });
    const ticketDTO = new TicketDTO(newTicket); // Transformamos el ticket usando el TicketDTO
    res.status(201).json(ticketDTO); // Enviamos el ticket creado
  } catch (error) {
    res.status(500).json({ error: 'Error al generar el ticket' });
  }
};

export const getTicketById = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await TicketDAO.getTicketById(id); // Buscamos el ticket por ID
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }
    const ticketDTO = new TicketDTO(ticket); // Transformamos el ticket usando el TicketDTO
    res.json(ticketDTO); // Enviamos el ticket transformado
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el ticket' });
  }
};

