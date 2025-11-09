"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serpapi_1 = require("../services/serpapi");
const zod_1 = require("zod");
const db_1 = require("../db");
const router = (0, express_1.Router)();
const searchProductSchema = zod_1.z.object({
    url: zod_1.z.string(),
});
router.get("/", (req, res) => {
    res.json({
        message: "hii there from the product routes !"
    });
});
router.get("/products/:productId/price-history", async (req, res) => {
    console.log("hii there");
    const productId = req.params.productId;
    if (!productId) {
        res.json({
            message: "product Id required"
        });
    }
    try {
        const priceHistoryData = await (0, serpapi_1.getProductPriceHistory)(productId);
        if (!priceHistoryData.organic_results) {
            res.json({
                message: "items not found with this product Id!"
            });
        }
        const priceHistory = priceHistoryData.organic_results.map((item) => ({
            title: item.title,
            price: item.extracted_price,
            link: item.link,
            rating: item.rating,
        }));
        res.json({ productId, priceHistory });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
router.post("/find", async (req, res) => {
    console.log("hii there");
    try {
        const { url } = searchProductSchema.parse(req.body);
        if (!url) {
            res.status(400).json({
                message: "didn't get the url!",
            });
        }
        const product = await db_1.prisma.product.findFirst({
            where: {
                url,
            },
            select: {
                name: true,
                url: true,
                imageUrl: true,
                currentPrice: true,
                priceHistory: true,
            }
        });
        res.status(200).json({
            product
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Internal server error !",
        });
    }
});
exports.default = router;
