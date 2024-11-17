import { UserDTO } from "../DTO/UserDTO.js";

export class UserService {
    constructor(dao) {
        this.dao = dao;
    }

    async getUsers() {
        const users = await this.dao.get();
        return users.map(user => new UserDTO(user));
    }

    async getUserById(id) {
        const user = await this.dao.getBy({ _id: id });
        if (user) {
            return new UserDTO(user);
        }
        return null; // Usuario no encontrado
    }

    async createUser(data) {
        const newUser = await this.dao.create(data);
        return new UserDTO(newUser);
    }

    async updateUserById(id, data) {
        const updatedUser = await this.dao.updateById(id, data);
        if (updatedUser) {
            return new UserDTO(updatedUser);
        }
        return null; // Usuario no encontrado o no actualizado
    }

    async deleteUserById(id) {
        return await this.dao.deleteById(id);
    }
}

