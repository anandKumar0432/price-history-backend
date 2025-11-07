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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serpapi_1 = require("../services/serpapi");
const router = (0, express_1.Router)();
router.get("/products/:productId/price-history", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    if (!productId) {
        res.json({
            message: "product Id required"
        });
    }
    try {
        const priceHistoryData = yield (0, serpapi_1.getProductPriceHistory)(productId);
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
}));
exports.default = router;
