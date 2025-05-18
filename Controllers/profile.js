
const db = require('../DB/db-connection')

exports.updateProfile=async(req, res) => {
    const { name, email, password, phone } = req.body;
    const updateProfileQuery = 'update usertest set name=?, email=?, password=?, phone=? where id=?';

    await db.query(updateProfileQuery, [name, email, password, phone, req.session.user.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.send("Error occurred");
        }
        if (results.affectedRows > 0) {
            res.send("Updated successfully 🎉");
        } else {
            res.send("Cannot update ");
        }
    });
}

exports.deleteAccount=async(req, res) => {

    const userId = req.session.user.id;
    const deleteProfileQuery = 'delete from usertest where id=?';

    const deleteCartItemsQuery = 'delete from cart_items where user_id = ?';
    const deletewishlistQuery = 'delete from wishlist_items where user_id = ?';
    const deleteordersQuery = 'delete from orders where user_id = ?';

        await db.query(deleteordersQuery, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.send("Error deleting orders related to this user");
        }
         db.query(deletewishlistQuery, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.send("Error deleting wishlist items");
        }
         db.query(deleteCartItemsQuery, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.send("Error deleting cart items");
        }
         db.query(deleteCartItemsQuery, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.send("Error deleting cart items");
        }
         db.query(deleteProfileQuery, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.send("Error occurred");
        }
        if (results.affectedRows > 0) {
            res.send("Deleted successfully 🚨");
        } else {
            res.send("Cannot delete ");
        }


        });
        });
    });
})
})

}