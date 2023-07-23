const mongoose=require('mongoose');

// const dotenv=require('dotenv');
// dotenv.config({ path: "backend/config/config.env" });

const connectDatabase=()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/MernProject",{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then ((data)=>{
        console.log(`Mongodb connected successfully`);
    })
}

module.exports=connectDatabase;