import { userModel } from "../models/userModel.js";

export class UserController{
    static async getBy(filtro={}){
        return await usuariosModel.findOne(filtro).lean()
    }

    static async addUser(usuario={}){
        let nuevoUsuario=await usuariosModel.create(usuario)
        return nuevoUsuario.toJSON()
    }
}