import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

class SessionController {
  // Login de usuario
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserService.getUserByEmail(email);
      if (!user || !user.verifyPassword(password)) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      const token = jwt.sign({ id: user._id, role: user.role }, config.SECRET, { expiresIn: '1h' });
      res.json({ message: 'Autenticación exitosa', token });
    } catch (error) {
      res.status(500).json({ error: 'Error en el inicio de sesión', message: error.message });
    }
  }

  // Obtener el usuario actual
  async getCurrentUser(req, res) {
    const user = req.user;
    const userDTO = new UserDTO(user);  // Solo la información necesaria
    res.json(userDTO);
  }
}

export default new SessionController();
