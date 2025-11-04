
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res)=>{
    res.json("hii there from the price history app!")
})


app.listen(3000);