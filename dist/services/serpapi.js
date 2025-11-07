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
exports.getProductPriceHistory = getProductPriceHistory;
const serpapi_1 = require("serpapi");
function getProductPriceHistory(productQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, serpapi_1.getJson)({
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
    });
}
