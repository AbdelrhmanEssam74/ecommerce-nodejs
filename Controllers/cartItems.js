const db = require('../DB/db-connection')


exports.getCartItems=async (req,res)=>{
const userId=req.params.uid;
    const cartGetQuery='select * from cart_items where user_id=? '
    await db.query(cartGetQuery,[userId],(err,results)=>{
        if(err) {
            console.error(err) 
            return res.send("Error retrieve")
        }
            res.json({
                message:`retrieved successfully! 🎉 cartitems for user id ${userId}`,
                data:results
            })
    })
}

exports.addItemToCart=async(req,res)=>{
    const{user_id,product_id ,quantity ,created_at,updated_at}=req.body;

    const cartGetQuery='insert into cart_items(user_id,product_id ,quantity ,created_at,updated_at) values (?,?,?,now(),now())'
    await db.query(cartGetQuery,[user_id,product_id ,quantity ,created_at,updated_at],(err,results)=>{
        if(err) {
            console.error(err) 
            return res.send("Error adding")
        }
        if(results.affectedRows >0){
            res.send("Added to cart successfully! 🎉")
        }
        else{
            res.send("Failed to add to cart.");
        }
    })
}

exports.deleteFromCart=async(req,res)=>{
const itemId=req.params.itemid;

    const cartItemDeleteQuery='delete from cart_items where id=?'
    await db.query(cartItemDeleteQuery,[itemId],(err,results)=>{
        if(err) {
            return res.send("Error deleting")
        }

        if(results.affectedRows >0){
            res.send(`removed successfully! 🚨  cartitem with id ${itemId}`)
        }
        else{ 
            res.send(`Error remove item with id ${itemId} from cart.`)
        }
    })

}


exports.updateCart=async(req,res)=>{
    const productId=req.params.productid;
    const cartItemDeleteQuery='update cart_items set quantity = quantity + 1 where product_id= ?'
    await db.query(cartItemDeleteQuery,[productId],(err,results)=>{
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating quantity');
        }

        if (results.affectedRows > 0) {
            res.send('Quantity increased successfully! 🎉');
        } else {
            res.status(404).send('Cart item not found.');
        }
    })

}