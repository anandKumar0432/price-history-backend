
import express from "express"
import bcrypt from "bcrypt"
import { prisma } from "../db"
import jwt from "jsonwebtoken"
import { z } from "zod"
const router = express.Router();

const signupSchema = z.object({
    email: z.string(),
    name: z.string(),
    password: z.string()
});

const signinSchema = z.object({
    email: z.string(),
    password : z.string(),
})

router.post("/signup", async (req, res) => {
    try {
        const parsedBody = signupSchema.parse(req.body);
        
        const hashedPassword = await bcrypt.hash(parsedBody.password, 10);

        const user = await prisma.user.create({
            data: {
                email: parsedBody.email,
                name: parsedBody.name,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true
            }
        });

        res.status(201).json({
            message: "User created successfully",
            user
        });
    } catch (e) {

        console.error(e);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post("/signin", async (req, res)=>{
    try{
        const {email, password} = signinSchema.parse(req.body);
        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        })
        if(!user){
            return res.status(400).json({
                message: "email or password doesn't match!"
            })
        }
        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid){
            return res.status(400).json({
                message: "email or password doesn't match!"
            })
        }
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET!, {expiresIn: "1d"});

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, 
        });

        res.status(200).json({
            message: "Signed in successfully",
            token
        });
    } catch(e){
        console.log(e);
        res.status(500).json({
            message: "something went wrong!"
        })
    }
    
})

export default router;
