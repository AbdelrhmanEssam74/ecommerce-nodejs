const db = require('../DB/db-connection')
const {use} = require("express/lib/application");

/*
 (user_id, full_name, street, city,  postal_code, country, type, phone)
 (1, 'Alice Johnson', '123 Maple St', 'Springfield',  '62701', 'USA', 'shipping', '123-456-7890')
 */

exports.address = async (req, res) => {
    const { userId, full_name, street, city,  postal_code,   phone } = req.body;

    const sql = `INSERT INTO addresses 
    (user_id, full_name, street, city,  postal_code,   phone) 
    VALUES (?, ?, ?,  ?, ?, ?)`;
    db.query(sql, [userId, full_name, street, city,  postal_code,   phone])
        .then(([result]) => {
            res.status(201).json({
                id: result.insertId,
                message: 'Address added successfully'
            });
        })
        .catch(err => {
            console.error('🔴 Error inserting address:', err);
            res.status(500).json({ error: 'Error adding address' });
        });

}
exports.getAddress = async (req, res) => {
    const userId = req.params.userId;
    try {
        const [rows] = await db.query('SELECT * FROM addresses WHERE user_id = ?', [userId]);
        return res.json(rows);
    } catch (err) {
        console.error("Error fetching addresses:", err);
        return res.status(500).json({ error: 'Error fetching addresses' });
    }
};