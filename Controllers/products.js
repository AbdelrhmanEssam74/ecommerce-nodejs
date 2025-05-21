const db = require('../DB/db-connection')


exports.addProductFunction = async(req,res)=>{
    
    const {name ,description, price, brand, category, stock, average_rating, total_reviews, created_at, updated_at}=req.body

    const insertProduct=`insert into products(name, description, price, brand, category, stock, average_rating, total_reviews) 
                values(?, ?, ?, ?, ?, ?, ?, ?)`

    await db.query(insertProduct,[name ,description, price, brand, category, stock, average_rating, total_reviews, created_at, updated_at],(err,results)=>{
        if(err) 
            {   
                console.error(err)
                return  res.send.status(500)("error occurs")
            }
        if(results>0){
            return res.status("Cannot add this product, already added before !")
        }
        else {return res.send("Product added successfully! 🎉")}
    })
}

exports.addProductImages= async (req,res)=>{
    const {product_id,image_url}=req.body
    const insertProductImage= 'insert into product_images (product_id, image_url) values (?, ?)';

        await db.query(insertProductImage, [product_id, image_url], (err, results) => {
        if (err) {
        console.error(err)
        return res.status(500).send('Error adding image');
        }
        res.send('Image added successfully! 🎉');
    });

}

exports.filteringProducts=async (req,res)=>{
    const{brand,category,min,max}=req.query;

    const params=[]

    let queryMain='select * from products where'

    if(req.query.brand){
        queryMain+=' brand=?'
        params.push(brand)
    }
    if(req.query.category){
        queryMain+='and category=?'
        params.push(category)
    }
    if(req.query.min){
        queryMain+='and price >=?'
        params.push(min)
    }
    if(req.query.max){
        queryMain+='and price <=?'
        params.push(max)
    }
    await db.query(queryMain,params,(err,results)=>{
        if(err){
            console.error(err)
            return res.send("error occured")
        }

        if(results.length>0){
            return res.json(results)
        }
        else{res.send("error")}
        })

}

exports.selctingProductWithItsId= async (req,res)=>{
    const productId=req.params.id;

    const productQuery='select * from products where id=?'
    const imagesQuery='select image_url from product_images where product_id=?'

    db.query(productQuery,[productId],(prodErr,productResults)=>{
        if(prodErr){
            console.error(prodErr)
            return res.status(500).send('error in product')
        }
        if(productResults.length===0){
            res.status(404).send("error gettting the product")
        }


        const product=productResults[0]
    
    db.query(imagesQuery,[productId],(imgErr,imgResults)=>{
        if(imgErr) 
        {
            console.error(imgErr)
            return res.send("error in image")
        }

        const images= imgResults.map(img=>img.image_url)

        res.json({
        ...product,
        images:images
        })
        })
    })
}


