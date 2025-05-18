const db = require('../DB/db-connection')


exports.getALlOrders=async(req,res)=>{
    const {id, user_id, shipping_address_id, shipping_option_id, payment_method, payment_status, order_status, total_amount, created_at, updated_at}=req.body;

    const getOrdersQuery='select * from orders';

    await db.query(getOrdersQuery,[id, user_id, shipping_address_id, shipping_option_id, payment_method, payment_status, order_status, total_amount, 'now()', 'now()'],(err,results)=>{
        if(err) return res.send("error occured")
        
        if(results.length>0){
            res.json({
                message:`Successfully got data 🎉`,
                orders:results})
            
        }
        else return res.send("erorr getting orders page")
    })
}


exports.deletelOrder=async(req,res)=>{
    const uId=req.params.uid;

    const getOrdersQuery='delete from orders where user_id=?';

    await db.query(getOrdersQuery,[uId],(err,results)=>{
        if(err) return res.send("error occured")
        
        if(results.affectedRows>0){
            console.error(err)
            res.send(`Successfully canceled order for user with id ${uId} 🚨`)
        }
        else{
            return res.send("Erorr canceling order") 
        }
    })
}


exports.editOrdershippingAddress=async(req,res)=>{
    const Id=req.params.id;
    const {shipping_address_id} =req.body;
    const getOrdersQuery=`update orders set shipping_address_id = ? where id = ? AND order_status ='processing'`;

    await db.query(getOrdersQuery,[shipping_address_id,Id],(err,results)=>{
        if(err) {
            console.error(err)
            return res.send("error occured")}
            
            if(results.affectedRows>0){
                console.error(err)
                res.send(`Successfully updated address for order with id ${Id} 🎉`)
            }
            else{
            return res.send("Erorr updating shipping address Order may already be shipped.") 
        }
    })
}





exports.editOrdershippingOption=async(req,res)=>{
    const Id=req.params.id;
    const {shipping_option_id} =req.body;
    const getOrdersQuery=`update orders set shipping_option_id = ? where id = ? AND order_status ='processing'`;

    await db.query(getOrdersQuery,[shipping_option_id,Id],(err,results)=>{
        if(err) {
            console.error(err)
            return res.send("error occured")}
            
            if(results.affectedRows>0){
                console.error(err)
                res.send(`Successfully updated shipping option for order with id ${Id} 🎉`)
            }
            else{
            return res.send("Erorr updating shipping option ") 
        }
    })
}


exports.updateOrderPaymentMethod=async(req,res)=>{
    const Id=req.params.id;
    const {payment_method} =req.body;
    const getOrdersQuery=`update orders set payment_method = ? where id = ? AND order_status ='processing'`;

    await db.query(getOrdersQuery,[payment_method,Id],(err,results)=>{
        if(err) {
            console.error(err)
            return res.send("error occured")}
            
            if(results.affectedRows>0){
                console.error(err)
                res.send(`Successfully updated payment method for order with id ${Id} 🎉`)
            }
            else{
            return res.send("Erorr updating payment method ") 
        }
    })
}


exports.cancelOrder=async(req,res)=>{
    const Id=req.params.id;

    const deletOrdersQuery='delete from orders where id=?';

    await db.query(deletOrdersQuery,[Id],(err,results)=>{
        if(err) return res.send("error occured")
        
        if(results.affectedRows>0){
            res.send(`Successfully canceled order for with id ${Id} 🚨`)
        }
        else{
            return res.send("Erorr canceling order") 
        }
    })
}