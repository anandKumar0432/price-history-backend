
import 'dotenv/config';
import express from "express";
import cors from "cors";
import mainRouter from "./routes/index"
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1",mainRouter);

app.listen(3001, ()=>{
    console.log("app listening on port 3001")
});