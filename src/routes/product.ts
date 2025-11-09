import { Router, Request, Response } from "express";
import { getProductPriceHistory } from "../services/serpapi";
import { z } from "zod"
import { prisma } from "../db";
const router = Router();

    const searchProductSchema = z.object({
      url: z.string(),
    })

    router.get("/", (req, res)=>{
      res.json({
        message: "hii there from the product routes !"
      })
    })

    router.get("/products/:productId/price-history", async (req: Request, res: Response) => {
      console.log("hii there");
      const productId = req.params.productId;
      if(!productId){
        res.json({
            message : "product Id required"
        })
      }
      try {
        const priceHistoryData = await getProductPriceHistory(productId);
        if(!priceHistoryData.organic_results){
            res.json({
                message : "items not found with this product Id!"
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
        console.log(error);
        res.status(500).json({ message: error.message });
      }
    });

    router.post("/find", async (req,res)=>{
      console.log("hii there");
        try{
          const { url } = searchProductSchema.parse(req.body);
          if(!url){
            res.status(400).json({
              message : "didn't get the url!",
            })
          }
          const product = await prisma.product.findFirst({
            where: {
              url,
            },
            select:{
              name : true,
              url : true,
              imageUrl :true,
              currentPrice : true,
              priceHistory : true,
            }
          })
          res.status(200).json({
            product
          })
        } catch(e){
          res.status(500).json({
            message: "Internal server error !",
          })
        }
    })

    export default router;
