const db = require('../DB/db-connection');

exports.searchProducts = async (req, res) => {
    const keyword = req.query.q;

    if (!keyword || keyword.trim() === '') {
        return res.status(400).json({error: 'Search keyword is required'});
    }

    try {
        const [results] = await db.query(
            `select *
             from products
             where name like ?
                OR brand like ?`,
            [`%${keyword}%`, `%${keyword}%`]
        );

        res.status(201).json(results);
    } catch (err) {

        res.status(500).json({status: 500, error: 'Search failed'});
    }
};
