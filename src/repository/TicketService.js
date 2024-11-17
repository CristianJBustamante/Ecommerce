import { TicketDTO } from "../DTO/TicketDTO.js";

export class TicketService {
    constructor(dao) {
        this.dao = dao;
    }

    async getTickets() {
        const tickets = await this.dao.get();
        return tickets.map(ticket => new TicketDTO(ticket));
    }

    async getTicketById(id) {
        const ticket = await this.dao.getBy({ _id: id });
        if (ticket) {
            return new TicketDTO(ticket);
        }
        return null; // Ticket no encontrado
    }

    async createTicket(data) {
        const newTicket = await this.dao.create(data);
        return new TicketDTO(newTicket);
    }

    async updateTicketById(id, data) {
        const updatedTicket = await this.dao.updateById(id, data);
        if (updatedTicket) {
            return new TicketDTO(updatedTicket);
        }
        return null; // Ticket no encontrado o no actualizado
    }

    async deleteTicketById(id) {
        return await this.dao.deleteById(id);
    }
}
