const db = require('../DB/db-connection')

exports.addReview = async (req, res) => {
    const {userId, productId, rating, comment} = req.body


    if (!userId || !productId || !rating) {
        return res.status(400).json({status: 400, error: 'userId, productId, and rating are required'});
    }

    try {
        await db.query(
            `insert into reviews (user_id, product_id, rating, comment)
             values (?, ?, ?, ?)`,
            [userId, productId, rating, comment]
        );

        const [avg] = await db.query(
            `select avg(rating) as avgRating, COUNT(*) as total
             from reviews
             where product_id = ?`,
            [productId]
        );

        await db.query(
            `update products
             set average_rating = ?,
                 total_reviews  = ?
             where id = ?`,
            [avg[0].avgRating, avg[0].total, productId]
        );

        res.status(201).json({status: 201, message: ' Review submitted successfully'});

    } catch (err) {
        res.status(500).json({status: 500, error: 'Error submitting review'});
    }
}

exports.getProductReviews = async (req, res) => {
    const productId = req.params.productId;
    try {
        const [reviews] = await db.query(
            `select r.rating, r.comment, r.created_at, u.name as user_name
             from reviews r
                      join users u on r.user_id = u.id
             where r.product_id = ?
             order by r.created_at desc `,
            [productId]
        );

        res.json(reviews);
    } catch (err) {
        res.status(500).json({status: 500, error: 'Failed to get reviews'});
    }
};
