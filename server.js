import path from 'path'
import { dirname } from 'path';
import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDb.js";
import ImportData from "./DataImport.js";
import productRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";

const __dirname = path.resolve();

dotenv.config();
connectDatabase();
const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}


app.use(express.json());

// API
app.use("/api/import", ImportData);
app.use("/api/products", productRoute);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});



if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"))

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  )
} else {
  app.get("/", (req, res) => {
    res.send("API is running....")
  })
}

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`server run in port ${PORT}`));
