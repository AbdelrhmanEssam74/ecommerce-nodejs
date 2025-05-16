const db = require('../DB/db-connection')

exports.createOrder = async (req, res) => {
    //? get the request
    //? validate and fetch
    //*  - check products exist
    //*  - ensure they are in stock
    //*  - get real price from Database
    //? calculate the total
    //? insert new order
    //? insert order items
    //! init payment -> not now
    const {userId, cartItems, addressId, shippingOptionId, paymentMethod} = req.body

    try {
        // check cart items
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                status: 400,
                error: "Cart is Empty"
            })
        }

        let total = 0
        let validateItems = []
        // Fetch product prices and validate stock
        for (let item of cartItems) {
            const [products] = await db.query('SELECT id , price , stock   FROM `products` where id =?', [item.productId])
            if (products.length === 0) {
                return res.status(400).json({
                    status: 400,
                    error: `Product ${item.productId} not found`
                })
            }
            let product = products[0]
            if (item.quantity > product.stock) {
                return res.status(400).json({status: 400, error: `Not enough stock for product ${item.productId}`})

            }
            let subTotal = item.quantity * product.price
            total += subTotal
            validateItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price
            })
        }

        //  Fetch shipping cost
        const [shipping] = await db.query('select cost from shipping_options where id =?', [shippingOptionId])
        if (shipping.length === 0) {
            return res.status(400).json({status: 400, error: 'Invalid shipping option'})
        }
        const shippingCost = shipping[0].cost
        total += shippingCost

        // insert order
        // user_id	shipping_address_id	shipping_option_id	payment_method	payment_status	order_status	total_amount
        const [orderResult] = await db.query(
            'insert into orders  (user_id , shipping_address_id ,shipping_option_id , payment_method , payment_status , order_status, total_amount) values (?,?,?,?,?,?,?)', [userId, addressId, shippingOptionId, paymentMethod, 'pending', 'processing', total]
        )
        const orderId = orderResult.insertId;

        // Insert order items
        // order_id	product_id	quantity	price
        for (let item of validateItems) {
            await db.query('insert into order_items (order_id , product_id , quantity , price) values (?,?,?,?)',
                [orderId, item.productId, item.quantity, item.price]
            )
        }
        res.status(201).json({success: 'Order created', orderId, total: total});
    } catch (err) {
        res.status(500).json({error: `Server error while creating order ${err}`});
    }
}