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
const zod_1 = require("zod");
const router = express_1.default.Router();
const signupSchema = zod_1.z.object({
    email: zod_1.z.string(),
    name: zod_1.z.string(),
    password: zod_1.z.string()
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
exports.default = router;
