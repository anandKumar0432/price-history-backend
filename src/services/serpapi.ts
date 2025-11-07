
import { getJson } from "serpapi"

export async function getProductPriceHistory(productQuery: string) {
    try{
        const response = await getJson({
            engine: "amazon",
            api_key: process.env.SERP_API_KEY,
            domain: "amazon.in",
            k: productQuery,
        });
        return response;
    } catch(e){
        console.log("error occured while fetching the price history", e);
        throw new Error("Failed to retrieve price !");
    }
}