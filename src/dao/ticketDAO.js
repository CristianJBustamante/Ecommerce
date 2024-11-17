import Ticket from '../models/ticketModel.js';

export class TicketDAO {
  // Crear un nuevo ticket
  async createTicket(cart, purchaser) {
    try {
      const ticket = new Ticket({
        code: `TICKET-${Math.floor(Math.random() * 1000000)}`,
        purchase_datetime: new Date(),
        amount: cart.products.reduce((total, item) => total + item.product.price * item.quantity, 0),
        purchaser
      });

      return await ticket.save();
    } catch (error) {
      throw new Error('Error al crear ticket');
    }
  }
}


