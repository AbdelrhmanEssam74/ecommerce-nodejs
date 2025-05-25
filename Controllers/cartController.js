const db = require('../DB/db-connection')


exports.getCartItems = async (req, res) => {
    const userId = req.params.uid;
    const cartGetQuery = 'select * from cart_items where user_id=? '
    await db.query(cartGetQuery, [userId])
        .then(([results]) => {
            if (results.length > 0) {
                res.json(results)
            } else {
                res.status(404).json({message: "No items found in the cart."})
            }
        })
}

exports.addItemToCart = async (req, res) => {
    const {user_id, product_id, quantity} = req.body;

    const cartGetQuery = 'insert into cart_items(user_id,product_id ,quantity ,created_at,updated_at) values (?,?,?,now(),now())'
    db.query(cartGetQuery, [user_id, product_id, quantity])
        .then(([results]) => {
            if (results.affectedRows > 0) {
                res.status(201).json({message: "Item added to cart successfully!"})
            } else {
                res.status(400).json({message: "Failed to add item to cart."})
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: "Error adding item to cart."})
        })
}

exports.deleteFromCart = async (req, res) => {
    const itemId = req.params.itemId;

    const cartItemDeleteQuery = 'delete from cart_items where id=?'
    db.query(cartItemDeleteQuery, [itemId])
        .then(([results]) => {
            if (results.affectedRows > 0) {
                res.status(200).json({message: "Item deleted from cart successfully!"})
            } else {
                res.status(404).json({message: "Cart item not found."})
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: "Error deleting item from cart."})
        })

}

exports.updateCart = (req, res) => {
    const itemId = req.params.itemId;
    const { quantity } = req.body;

    if (!quantity || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Valid quantity must be provided." });
    }

    const updateCartQuery = 'UPDATE cart_items SET quantity =  ? WHERE id = ?';

    db.query(updateCartQuery, [quantity, itemId])
        .then(([results]) => {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: "Cart updated successfully!" });
            } else {
                res.status(404).json({ message: "Cart item not found." });
            }
        })
        .catch(err => {
            console.error("Error updating cart:", err);
            res.status(500).json({ message: "Error updating cart." });
        });
};
