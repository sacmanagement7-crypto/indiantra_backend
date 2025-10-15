import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./Config/db.js";
import cors from "cors"
import { userRouter } from "./Routers/UserRouter.js";
import { categoryRouter } from "./Routers/categoryRouter.js";
import { productRouter } from "./Routers/productRouter.js";
import path from "path"
import {cartRouter} from "./Routers/cartRouter.js"
import wishlistRouter from "./Routers/wishlistRouter.js"
import { orderRouter } from "./Routers/orderRouter.js";
import { vendorRouter } from "./Routers/vendorRouter.js";
import { fileURLToPath } from 'url';
import { contactRouter } from "./Routers/contactRouter.js";
import { reviewRouter } from "./Routers/reviewRouter.js";

//.environment variables
dotenv.config();

const app = express();

//cross origin resourse sharing policy
app.use(cors())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//configurations to accept data
app.use(express.json());
app.use(express.urlencoded({extended:true}))


try {
    connectDb();
    app.listen(process.env.PORT||3000,()=>{
         console.log("app is running....");
         console.log("mongodb connected....")
    })
} catch (error) {
    console.log(error);
}
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes
app.use('/api',userRouter);
app.use('/api',categoryRouter);
app.use('/api',productRouter);
app.use('/api',contactRouter)
app.use('/api/cart',cartRouter)
app.use("/api/wishlist", wishlistRouter);
app.use("/api/order",orderRouter);
app.use("/api/vendor",vendorRouter);
app.use("/api",reviewRouter);

app.get('/',(req,res)=>{
    res.send("Api is alive")
})

