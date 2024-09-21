import Product from "../models/product.js";

// Add a new product
const addNewProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock,
        });
        const savedProduct = await newProduct.save();
        res.status(201).json({ success: true, message: "Produt added successfully", savedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addNewProduct, getAllProducts };