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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../src/db");
function generateMonthlyPrices(prices) {
    var history = [];
    for (var i = 0; i < 12; i++) {
        history.push({
            price: prices[i],
            date: new Date(2024, i, 15),
        });
    }
    return history;
}
var products = [
    {
        name: "iPhone 15",
        url: "https://example.com/iphone15",
        imageUrl: "https://example.com/iphone15.jpg",
        prices: [90000, 89000, 88000, 87000, 86000, 85000, 85500, 86000, 86500, 87000, 87500, 88000],
    },
    {
        name: "Samsung Galaxy S24",
        url: "https://example.com/galaxy-s24",
        imageUrl: "https://example.com/galaxy-s24.jpg",
        prices: [85000, 84500, 83000, 82000, 81000, 80000, 80500, 81000, 82000, 82500, 83000, 83500],
    },
    {
        name: "MacBook Air M3",
        url: "https://example.com/macbook-air-m3",
        imageUrl: "https://example.com/macbook-air-m3.jpg",
        prices: [120000, 118000, 117000, 116000, 115000, 114000, 113000, 112000, 113000, 114000, 115000, 116000],
    },
];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, products_1, product, priceHistory, latestPrice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, products_1 = products;
                    _a.label = 1;
                case 1:
                    if (!(_i < products_1.length)) return [3 /*break*/, 4];
                    product = products_1[_i];
                    priceHistory = generateMonthlyPrices(product.prices);
                    latestPrice = priceHistory[priceHistory.length - 1].price;
                    return [4 /*yield*/, db_1.prisma.product.create({
                            data: {
                                name: product.name,
                                url: product.url,
                                imageUrl: product.imageUrl,
                                currentPrice: latestPrice,
                                priceHistory: { create: priceHistory },
                            },
                        })];
                case 2:
                    _a.sent();
                    console.log("Added/Updated ".concat(product.name));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () {
    console.log("Seeding completed!");
    db_1.prisma.$disconnect();
})
    .catch(function (err) {
    console.error("Error seeding data:", err);
    db_1.prisma.$disconnect();
});
