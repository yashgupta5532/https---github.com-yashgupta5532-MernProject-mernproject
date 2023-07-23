const app=require('./App')
const connectDatabase=require('./config/database')

const dotenv=require('dotenv');

// dotenv.config({path:"backend\config\config.env"})

const PORT=process.env.PORT || 8000

const MONGO_URI=process.env.MONGO_URI
console.log(MONGO_URI)

process.on("uncaughtException",err=>{
    console.log(err.message);
    console.log("shutting down the server due to unhandled rejection ")
    process.exit(1);
})
connectDatabase();

const server=app.listen(PORT,()=>{
    console.log(`app is listening on port :${PORT}`)
})


//unhandled uncaught rejection error -->mongodb src error

process.on("unhandledRejection",err=>{
    console.log(`error is ${err}`)
    console.log("shutting down the server due to unhandled rejection ")
    server.close(()=>{
        process.exit(1)
    });
    
})
