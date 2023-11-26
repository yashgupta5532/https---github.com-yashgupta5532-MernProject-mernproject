const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();
const errorMiddleware = require("./middleware/error");
const dotenv = require("dotenv");
dotenv.config({ path: "./backend/config/.env" });

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//import routes
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

//middlewares for errors
app.use(errorMiddleware);

module.exports = app;
