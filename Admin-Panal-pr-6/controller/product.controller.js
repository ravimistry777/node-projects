const Category = require('../model/category.model');
const SubCategory = require('../model/subCategory.model');
const ExtraCategory = require('../model/extraCategory.model');
const Product = require('../model/product.model');
const path = require('path');
const fs = require('fs');

// Render Add Product Page
exports.addProductPage = async (req, res) => {
    try {
        let categories = await Category.find({ status: true });
        let subCategories = await SubCategory.find({ status: true });
        return res.render("product/addProduct", { categories, subCategories });
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

// Handle Add Product
exports.addProduct = async (req, res) => {
    try {
        let { categoryId, subCategoryId, extraCategoryId, productName, productPrice, productDescription, productStock, productSize } = req.body;
        let imagePath = "";
        
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        await Product.create({
            categoryId,
            subCategoryId,
            extraCategoryId,
            productName,
            productPrice,
            productDescription,
            productStock,
            productSize: Array.isArray(productSize) ? productSize : [productSize], // Ensure it's an array
            productImage: imagePath
        });

        req.flash('success', 'Product Added Successfully');
        return res.redirect("/product/view-products");

    } catch (error) {
        console.log(error);
        req.flash('error', 'Something went wrong');
        return res.redirect("/product/add-product");
    }
}

// Render View Products Page (Card Layout)
exports.viewProducts = async (req, res) => {
    try {
        let search = req.query.search ? req.query.search : "";
        let { categoryId, subCategoryId, extraCategoryId } = req.query;
        let query = {};

        // 1. Search Logic (across Product Name, Category, SubCategory, ExtraCategory)
        if (search) {
            // Find IDs of matching categories/subcategories/extracategories
            const matchedCategories = await Category.find({ categoryName: { $regex: search, $options: 'i' } }).select('_id');
            const matchedSubCategories = await SubCategory.find({ subCategoryName: { $regex: search, $options: 'i' } }).select('_id');
            const matchedExtraCategories = await ExtraCategory.find({ extraCategoryName: { $regex: search, $options: 'i' } }).select('_id');

            query.$or = [
                { productName: { $regex: search, $options: "i" } },
                { categoryId: { $in: matchedCategories } },
                { subCategoryId: { $in: matchedSubCategories } },
                { extraCategoryId: { $in: matchedExtraCategories } }
            ];
        }

        // 2. Filter Logic (Specific Filters)
        if (categoryId) query.categoryId = categoryId;
        if (subCategoryId) query.subCategoryId = subCategoryId;
        if (extraCategoryId) query.extraCategoryId = extraCategoryId;

        let products = await Product.find(query)
            .populate('categoryId')
            .populate('subCategoryId')
            .populate('extraCategoryId');

        let categories = await Category.find({ status: true });

        return res.render("product/viewProduct", { 
            products, 
            query: req.query,
            categories
        });
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

// Render Update Product Page
exports.updateProductPage = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        let categories = await Category.find({ status: true });
        let subCategories = await SubCategory.find({ categoryId: product.categoryId, status: true });
        let extraCategories = await ExtraCategory.find({ subCategoryId: product.subCategoryId, status: true });
        
        return res.render("product/updateProduct", { 
            product, 
            categories,
            subCategories,
            extraCategories 
        });
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

// Handle Update Product
exports.updateProduct = async (req, res) => {
    try {
        let { categoryId, subCategoryId, extraCategoryId, productName, productPrice, productDescription, productStock, productSize } = req.body;
        let product = await Product.findById(req.params.id);
        
        if (req.file) {
            // Delete old image
            if (product.productImage) {
                let oldImagePath = path.join(__dirname, "..", product.productImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            // Set new image
            product.productImage = `/uploads/${req.file.filename}`;
        }

        product.categoryId = categoryId;
        product.subCategoryId = subCategoryId;
        product.extraCategoryId = extraCategoryId;
        product.productName = productName;
        product.productPrice = productPrice;
        product.productDescription = productDescription;
        product.productStock = productStock;
        product.productSize = Array.isArray(productSize) ? productSize : (productSize ? [productSize] : []);

        await product.save();

        req.flash('success', 'Product Updated Successfully');
        return res.redirect("/product/view-products");

    } catch (error) {
        console.log(error);
        req.flash('error', 'Something went wrong');
        return res.redirect("/product/view-products");
    }
}

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect("/product/view-products");
        }

        if (product.productImage) {
            let oldImagePath = path.join(__dirname, "..", product.productImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        req.flash('success', 'Product Deleted Successfully');
        return res.redirect("/product/view-products");
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

// API to get SubCategories by Category ID (For AJAX)
exports.getSubCategoriesByCategory = async (req, res) => {
    try {
        let subCategories = await SubCategory.find({ categoryId: req.query.id, status: true });
        return res.json({ subCategories });
    } catch (error) {
        console.log(error);
        return res.json({ subCategories: [] });
    }
}

// API to get ExtraCategories by SubCategory ID (For AJAX)
exports.getExtraCategoriesBySubCategory = async (req, res) => {
    try {
        let extraCategories = await ExtraCategory.find({ subCategoryId: req.query.id, status: true });
        return res.json({ extraCategories });
    } catch (error) {
        console.log(error);
        return res.json({ extraCategories: [] });
    }
}

// Render Product Details Page
exports.viewProductDetails = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id)
            .populate('categoryId')
            .populate('subCategoryId')
            .populate('extraCategoryId');
        
        return res.render("product/productDetails", { product });
    } catch (error) {
        console.log(error);
        return res.redirect("/product/view-products");
    }
}
