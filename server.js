const express = require ("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const authRoutes = require("./routes/auth");
const productRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");


const router = express.Router();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());


//import routes

//import middleware

//connect to db
let isConnected = false;
console.log(process.env.MONGODB_URL);
(async () => {
    try{
        await mongoose.connect( process.env.MONGODB_URL, {
            dbName: "ecommerce_DB"
        });
        console.log("mongodb connected");
        isConnected = true;
        
    } catch(error) {
        console.error("could not connect to db");
        
    }
})();



//routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);



app.listen(8000, () => console.log('Listening...'));
