import mongoose from 'mongoose';


const ticketSchema = new mongoose.Schema({
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
  purchaseDate: { type: Date, default: Date.now },
}, { timestamps: true }); 

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;



