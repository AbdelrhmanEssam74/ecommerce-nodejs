const db = require('../DB/db-connection')


exports.getProducts = async (req, res) => {
    const sql = `
        SELECT 
            p.id,
            p.name,
            p.description,
            p.price,
            p.brand,
            p.category,
            p.stock,
            p.average_rating,
            p.total_reviews,
            pi.image_url
        FROM 
            products p
        LEFT JOIN 
            product_images pi ON p.id = pi.product_id
    `;

    await db.query(sql)
        .then(([results]) => {
            if (results.length === 0) {
                return res.status(404).json({ message: "No products found" });
            }

            // Grouping products with multiple images
            const productsMap = {};

            results.forEach(row => {
                if (!productsMap[row.id]) {
                    productsMap[row.id] = {
                        id: row.id,
                        name: row.name,
                        description: row.description,
                        price: row.price,
                        brand: row.brand,
                        category: row.category,
                        stock: row.stock,
                        average_rating: row.average_rating,
                        total_reviews: row.total_reviews,
                        images: []
                    };
                }

                if (row.image_url) {
                    productsMap[row.id].images.push(row.image_url);
                }
            });

            const products = Object.values(productsMap);
            return res.status(200).json(products);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: "Error retrieving products" });
        });
};

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

    const productQuery = 'SELECT * FROM products WHERE id = ?';
    const imagesQuery = 'SELECT image_url FROM product_images WHERE product_id = ?';

    db.query(productQuery, [productId])
        .then(([productResults]) => {
            if (productResults.length === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const product = productResults[0];

            return db.query(imagesQuery, [productId])
                .then(([imgResults]) => {
                    const images = imgResults.map(img => img.image_url);

                    return res.status(200).json({
                        ...product,
                        images: images
                    });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error retrieving product or images' });
        });
};




