const db = require('../DB/db-connection')

exports.getSpecificOrders = async (req, res) => {
    const userId = req.params.userId
    try {
        const [orders] = await db.query(
            `select id, total_amount, payment_status, order_status, created_at
             from orders
             where user_id = ?
             order by created_at desc `,
            [userId]
        );

        res.status(200).json(orders);

    } catch (err) {
        res.status(500).json({error: 'Failed to fetch orders'});
    }
}

exports.getOrderDetails = async (req, res) => {
    const orderId = req.params.orderId;

    try {
        //* Get main order info
        const [orderRows] = await db.query(
            `select o.id,
                    o.total_amount,
                    o.payment_status,
                    o.order_status,
                    o.payment_method,
                    s.name as shipping_method,
                    o.shipping_address_id,
                    o.created_at
             from orders o
                      join shipping_options s on o.shipping_option_id = s.id
             where o.id = ?`,
            [orderId]
        );
        if (orderRows.length === 0) {
            return res.status(404).json({error: 'Order not found'});
        }

        const order = orderRows[0];

        //? Get shipping address
        const [addressRows] = await db.query(
            `select full_name, street, city,  postal_code, country, phone
             from addresses
             where id = ?`,
            [order.shipping_address_id]
        );
        const address = addressRows[0] || {};

        //? Get ordered products
        const [items] = await db.query(
            `select oi.product_id, p.name, p.brand, oi.quantity, oi.price
             from order_items oi
                      join products p on oi.product_id = p.id
             where oi.order_id = ?`,
            [orderId]
        );

        res.status(200).json({
            order: {
                id: order.id,
                total: order.total_amount,
                status: order.order_status,
                payment: order.payment_status,
                method: order.payment_method,
                shipping: order.shipping_method,
                placedAt: order.created_at,
                address
            },
            items
        });

    } catch (err) {
        res.status(500).json({error: 'Failed to fetch order details'});
    }
};
