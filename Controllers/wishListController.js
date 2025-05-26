const db = require('../DB/db-connection');

exports.getWishlistItems = (req, res) => {
    const userId = req.params.uid;
    const wishlistGetQuery = 'SELECT * FROM wishlist_items WHERE user_id = ?';

    db.query(wishlistGetQuery, [userId])
        .then(([results]) => {
            res.status(200).json({
                message: `Retrieved successfully!  Wishlist for user id ${userId}`,
                data: results
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Error retrieving wishlist" });
        });
};

exports.addItemToWishList = (req, res) => {
    const { user_id, product_id } = req.body;
    const wishlistAddQuery = 'INSERT INTO wishlist_items (user_id, product_id, created_at) VALUES (?, ?, NOW())';

    db.query(wishlistAddQuery, [user_id, product_id])
        .then(([results]) => {
            if (results.affectedRows > 0) {
                res.status(201).json({ message: "Added to wishlist! " });
            } else {
                res.status(400).json({ message: "Failed to add to wishlist." });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Error adding to wishlist" });
        });
};

exports.removeItemFromWishList = (req, res) => {
    const itemId = req.params.itemid;
    const wishlistItemDeleteQuery = 'DELETE FROM wishlist_items WHERE id = ?';

    db.query(wishlistItemDeleteQuery, [itemId])
        .then(([results]) => {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: `Removed successfully!  Wishlist item with id ${itemId}` });
            } else {
                res.status(404).json({ message: `Item with id ${itemId} not found in wishlist.` });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Error deleting from wishlist" });
        });
};
