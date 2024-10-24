import jwt from "jsonwebtoken"
import { config } from "../config/config.js";
export const auth=(req, res, next)=>{

    if(!req.headers.authorization){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Unauthorized - no llega token`})
    }

    let token=req.headers.authorization.split(" ")[1]   
    try {
        req.user=jwt.verify(token, config.SECRET)
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`${error.message}`})
    }

    next()
}