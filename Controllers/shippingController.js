const db = require('../DB/db-connection')

exports.getShippingOptions = (req, res) => {
    // get shipping options form database
    db.query('select * from shipping_options')
        .then(([rows]) => {
            return res.json(rows)
        })
        .catch(err => {
            return res.status(500).json({error: 'Error loading shipping options'})
        })
}