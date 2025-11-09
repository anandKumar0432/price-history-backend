import express from "express"
const router = express.Router();
import userRouter from "./user"
import productRouter from "../routes/product"

router.use("/user", userRouter);
router.use("/product",productRouter)

export default router;
