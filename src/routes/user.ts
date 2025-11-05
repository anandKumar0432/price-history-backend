
import express from "express"
import bcrypt from "bcrypt"
import { prisma } from "../db"
import { z } from "zod"
const router = express.Router();

const signupSchema = z.object({
    email: z.string(),
    name: z.string(),
    password: z.string()
});

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

export default router;
