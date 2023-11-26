const app = require("./App");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");

process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log("shutting down the server due to uncaughtException error ");
  process.exit(1);
});

connectDatabase();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// const port=process.env.PORT || 4000
const server = app.listen(process.env.PORT, () => {
  console.log(`app is listening on port :${process.env.PORT}`);
});

//unhandled uncaught rejection error -->mongodb src error

process.on("unhandledRejection", (err) => {
  console.log(`error is ${err}`);
  console.log("shutting down the server due to unhandled rejection ");
  server.close(() => {
    process.exit(1);
  });
});
