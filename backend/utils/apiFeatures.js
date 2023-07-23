class ApiFeatures{
    constructor(query,queryStr){
        this.query=query
        this.queryStr=queryStr
    }

    search(){
        const keyword=this.queryStr.keyword ? { //quertyStr -->keyword
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"
            },
        }:{};
        // console.log(keyword)
        this.query=this.query.find({...keyword})
        return this ;//this --> ApiFeatures class
    }

    filter(){
        const queryCopy ={...this.queryStr}  //copy of queryStr to queryCopy

        //we have to remove some fields from queryCopy
        const removeFields=["keyword","page","limit"]
        removeFields.forEach((key)=>{
            delete queryCopy[key]
        })
        let queryStr=JSON.stringify(queryCopy);  // -->converting into string
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);

        this.query=this.query.find(JSON.parse(queryStr));  // -->convert into objects

        return this;
    }
    pagination(resultPerPage){
        const currentPage=this.queryStr.page || 1

        const skip=resultPerPage * (currentPage-1)
        
        this.query =this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports=ApiFeatures