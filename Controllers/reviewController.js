const db = require('../DB/db-connection')

exports.addReview = (req, res) => {
    const { userId, productId, rating, comment } = req.body;

    if (!userId || !productId || !rating) {
        return res.status(400).json({ status: 400, error: 'userId, productId, and rating are required' });
    }

    const insertReviewQuery = `
        INSERT INTO reviews (user_id, product_id, rating, comment)
        VALUES (?, ?, ?, ?)
    `;
    const getAverageQuery = `
        SELECT AVG(rating) AS avgRating, COUNT(*) AS total
        FROM reviews
        WHERE product_id = ?
    `;
    const updateProductQuery = `
        UPDATE products
        SET average_rating = ?, total_reviews = ?
        WHERE id = ?
    `;

    db.query(insertReviewQuery, [userId, productId, rating, comment])
        .then(() => {
            return db.query(getAverageQuery, [productId]);
        })
        .then(([avgResult]) => {
            const avgRating = avgResult[0].avgRating;
            const totalReviews = avgResult[0].total;
            return db.query(updateProductQuery, [avgRating, totalReviews, productId]);
        })
        .then(() => {
            res.status(201).json({ status: 201, message: 'Review submitted successfully' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ status: 500, error: 'Error submitting review' });
        });
};


exports.getProductReviews = (req, res) => {
    const productId = req.params.productId;

    const getReviewsQuery = `
        SELECT r.rating, r.comment, r.created_at, u.name AS user_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.product_id = ?
        ORDER BY r.created_at DESC
    `;

    db.query(getReviewsQuery, [productId])
        .then(([reviews]) => {
            res.json(reviews);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ status: 500, error: 'Failed to get reviews' });
        });
};

