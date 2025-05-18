const db = require('../DB/db-connection')

exports.getWishlistItems=async(req,res)=>{
const userId=req.params.uid;
    const wishlistGetQuery='select * from wishlist_items where user_id=? '
    await db.query(wishlistGetQuery,[userId],(err,results)=>{
        if(err) {
            console.error(err) 
            return res.send("Error retrieve")
        }
            res.json({
                message:`retrieved successfully! 🎉  wishlist for user id ${userId}`,
                data:results
            })
    })
}



exports.addItemToWishList=async(req,res)=>{
    const{user_id,product_id ,created_at}=req.body;

    const wishlistGetQuery='insert into wishlist_items(user_id,product_id ,created_at) values (?,?,now())'
    await db.query(wishlistGetQuery,[user_id,product_id ,created_at],(err,results)=>{
        if(err) {
            console.error(err) 
            return res.send("Error adding")
        }
        if(results.affectedRows >0){
            res.send("Added to wishlist! 🎉")
        }
        else{
            res.send("Failed to add to wishlist.");
        }
    })
}

exports.removeItemFromWishList=async(req,res)=>{
const itemId=req.params.itemid;

   
    const wishlistItemDeleteQuery='delete from wishlist_items where id=?'
    await db.query(wishlistItemDeleteQuery,[itemId],(err,results)=>{
        if(err) {
            return res.send("Error deleting")
        }

        if(results.affectedRows >0){
            res.send(`removed successfully! 🚨  wishlist with id ${itemId}`)
        }
        else{ 
            res.send(`Error remove item with id ${itemId} from wishlist.`)
        }
    })

}