"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductPriceHistory = getProductPriceHistory;
const serpapi_1 = require("serpapi");
async function getProductPriceHistory(productQuery) {
    try {
        const response = await (0, serpapi_1.getJson)({
            engine: "amazon",
            api_key: process.env.SERP_API_KEY,
            domain: "amazon.in",
            k: productQuery,
        });
        return response;
    }
    catch (e) {
        console.log("error occured while fetching the price history", e);
        throw new Error("Failed to retrieve price !");
    }
}
