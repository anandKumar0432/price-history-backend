"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const router = express_1.default.Router();
const signupSchema = zod_1.z.object({
    email: zod_1.z.string(),
    name: zod_1.z.string(),
    password: zod_1.z.string()
});
const signinSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string(),
});
router.get("/", (req, res) => {
    res.json({
        message: "hii there !"
    });
});
router.post("/signup", async (req, res) => {
    try {
        const parsedBody = signupSchema.parse(req.body);
        const hashedPassword = await bcrypt_1.default.hash(parsedBody.password, 10);
        const alreadyExist = await db_1.prisma.user.findUnique({
            where: {
                email: parsedBody.email,
            }
        });
        if (alreadyExist) {
            res.status(401).json({
                message: "user already exists !",
            });
        }
        const user = await db_1.prisma.user.create({
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
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = signinSchema.parse(req.body);
        const user = await db_1.prisma.user.findUnique({
            where: {
                email,
            }
        });
        if (!user) {
            return res.status(400).json({
                message: "email or password doesn't match!"
            });
        }
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({
                message: "email or password doesn't match!"
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
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
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "something went wrong!"
        });
    }
});
exports.default = router;
