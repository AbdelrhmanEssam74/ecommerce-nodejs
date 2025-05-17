const db = require('../DB/db-connection');
const paypalClient = require('../DB/paypalClient');

exports.createPayPalOrder = async (req, res) => {
    const { orderId } = req.body;

    try {
        // Fetch order from DB
        const [orderRows] = await db.query('SELECT total_amount FROM orders WHERE id = ?', [orderId]);

        if (orderRows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const total = orderRows[0].total_amount;

        // Create PayPal Order
        const request = new paypalClient.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                reference_id: orderId.toString(),
                amount: {
                    currency_code: 'USD',
                    value: total.toFixed(2)
                }
            }],
            application_context: {
                brand_name: 'Your Store',
                landing_page: 'NO_PREFERENCE',
                user_action: 'PAY_NOW',
                return_url: `http://localhost:3000/paypal-success?orderId=${orderId}`,
                cancel_url: `http://localhost:3000/paypal-cancel?orderId=${orderId}`
            }
        });

        const response = await paypalClient.execute(request);
        const approvalUrl = response.result.links.find(link => link.rel === 'approve').href;

        res.json({
            approvalUrl,
            paypalOrderId: response.result.id,
            total
        });

    } catch (err) {
        res.status(500).json({error: 'Could not create PayPal order' });
    }
};
