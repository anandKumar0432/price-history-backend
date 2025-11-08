"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serpapi_1 = require("../services/serpapi");
const router = (0, express_1.Router)();
router.get("/products/:productId/price-history", async (req, res) => {
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
exports.default = router;
