import { Router, Request, Response } from "express";
    import { getProductPriceHistory } from "../services/serpapi";

    const router = Router();

    router.get("/products/:productId/price-history", async (req: Request, res: Response) => {
      const { productId } = req.params; 
      if(!productId){
        res.json({
            message : "product id required"
        })
      }
      try {
        const productQuery = productId;
        const priceHistoryData = await getProductPriceHistory(productQuery);
        if(!priceHistoryData.organic_results){
            res.json({
                message : "items not found with this product id!"
            })
        }
        const priceHistory = priceHistoryData.organic_results.map((item : any) =>({
            title: item.title,
            price: item.extracted_price,
            link: item.link,
            rating: item.rating,
        }))

        res.json({ productId, priceHistory });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    });

    export default router;
