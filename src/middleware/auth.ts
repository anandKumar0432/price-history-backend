import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

export const authenticate = (req : Request, res: Response, next: NextFunction)=>{
    const token = req.cookies.token;

    if(!token){
        res.status(401).json({
            message: "access denied, no token provided !"
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user= decoded;
        next();
    } catch(e){
        res.status(500).json({
            message: "something went wrong !"
        })
    }
}
