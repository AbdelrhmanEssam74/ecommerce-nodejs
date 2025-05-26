const db = require('../DB/db-connection')


exports.getProducts = async (req, res) => {
    const sql = 'SELECT * FROM products';
    await db.query(sql).then(([results]) => {
        if (results.length > 0) {
            return res.json(results);
        } else {
            return res.status(404).json("No products found");
        }
    })
}
exports.addProductFunction = async (req, res) => {
    // Expected JSON body:
    // {
    //   "name": "Product Name",
    //   "description": "Product Description",
    //   "price": 100,
    //   "brand": "Brand Name",
    //   "category": "Category",
    //   "stock": 50,
    //   "images": ["url1", "url2"]
    // }

    const {name, description, price, brand, category, stock, images} = req.body;

    const productQuery = 'INSERT INTO products (name, description, price, brand, category, stock) VALUES (?, ?, ?, ?, ?, ?)';
    const productImagesQuery = 'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)';

    // Basic validation
    if (!name || !description || !price || !brand || !category || !stock) {
        return res.status(400).json({error: "All fields are required"});
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({error: "At least one image URL is required"});
    }

    try {
        const [result] = await db.query(productQuery, [name, description, price, brand, category, stock]);
        const productId = result.insertId;

        const imageInsertPromises = images.map(imageUrl => {
            return db.query(productImagesQuery, [productId, imageUrl]);
        });

        await Promise.all(imageInsertPromises);

        res.status(201).json({success: "Product added successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Error adding product"});
    }
};


exports.filteringProducts = (req, res) => {
    const { brand, category, min, max } = req.query;
    const params = [];
    let queryMain = 'SELECT * FROM products';
    const conditions = [];

    if (brand) {
        conditions.push('brand = ?');
        params.push(brand);
    }
    if (category) {
        conditions.push('category = ?');
        params.push(category);
    }
    if (min) {
        conditions.push('price >= ?');
        params.push(min);
    }
    if (max) {
        conditions.push('price <= ?');
        params.push(max);
    }

    if (conditions.length > 0) {
        queryMain += ' WHERE ' + conditions.join(' AND ');
    }

    db.query(queryMain, params)
        .then(([results]) => {
            res.json(results);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while filtering products' });
        });
};


exports.selctingProductWithItsId = async (req, res) => {
    const productId = req.params.id;

    const productQuery = 'select * from products where id=?'
    const imagesQuery = 'select image_url from product_images where product_id=?'

    db.query(productQuery, [productId], (prodErr, productResults) => {
        if (prodErr) {
            console.error(prodErr)
            return res.status(500).json('error in product')
        }
        if (productResults.length === 0) {
            res.status(404).json("error gettting the product")
        }


        const product = productResults[0]

        db.query(imagesQuery, [productId], (imgErr, imgResults) => {
            if (imgErr) {
                console.error(imgErr)
                return res.json("error in image")
            }

            const images = imgResults.map(img => img.image_url)

            res.json({
                ...product,
                images: images
            })
        })
    })
}



