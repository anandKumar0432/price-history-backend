"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedBody = signupSchema.parse(req.body);
        const hashedPassword = yield bcrypt_1.default.hash(parsedBody.password, 10);
        const user = yield db_1.prisma.user.create({
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
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = signinSchema.parse(req.body);
        const user = yield db_1.prisma.user.findUnique({
            where: {
                email,
            }
        });
        if (!user) {
            return res.status(400).json({
                message: "email or password doesn't match!"
            });
        }
        const isValid = yield bcrypt_1.default.compare(password, user.password);
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
}));
exports.default = router;
