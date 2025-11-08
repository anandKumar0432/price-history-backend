import { prisma } from "../src/db"

type MonthlyPrice = { price: number; date: Date };

function generateMonthlyPrices(prices: number[]) : MonthlyPrice[] {
  const history: MonthlyPrice[] = [];
  for (let i = 0; i < 12; i++) {
    history.push({
      price: prices[i],
      date: new Date(2024, i, 15),
    });
  }
  return history;
}

const products = [
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

async function main() {
  for (const product of products) {
    const priceHistory = generateMonthlyPrices(product.prices);
    const latestPrice = priceHistory[priceHistory.length - 1].price;

    await prisma.product.create({
      data: {
        name: product.name,
        url: product.url,
        imageUrl: product.imageUrl,
        currentPrice: latestPrice,
        priceHistory: { create: priceHistory },
      },
    });

    console.log(`Added/Updated ${product.name}`);
  }
}

main()
  .then(() => {
    console.log("Seeding completed!");
    prisma.$disconnect();
  })
  .catch((err) => {
    console.error("Error seeding data:", err);
    prisma.$disconnect();
  });
