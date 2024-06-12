import express from "express";
import dataRoutes from "./routes/datas.js"
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", dataRoutes);

app.listen(3001, () => console.log("rodando na porta 3001"));
 