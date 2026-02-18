const Category = require('../model/category.model');
const SubCategory = require('../model/subCategory.model');
const Product = require('../model/product.model');
const User = require('../model/user.model');
const bcrypt = require('bcrypt');

const ExtraCategory = require('../model/extraCategory.model');

exports.homePage = async (req, res) => {
    try {
        const { search, subcategory, extracategory, sort, category, page = 1 } = req.query;
        const limit = 9;
        const skip = (page - 1) * limit;
        
        const categories = await Category.find({});
        const subcategories = await SubCategory.find({}).populate('categoryId');
        const extracategories = await ExtraCategory.find({}).populate('subCategoryId');

        let filter = {};
        if (search) {
            // Find categories, subcategories, or extracategories that match the search term
            const matchedCats = await Category.find({ categoryName: { $regex: search, $options: 'i' } });
            const matchedSubs = await SubCategory.find({ subCategoryName: { $regex: search, $options: 'i' } });
            const matchedExtras = await ExtraCategory.find({ extraCategoryName: { $regex: search, $options: 'i' } });

            const catIds = matchedCats.map(c => c._id);
            const subIds = matchedSubs.map(s => s._id);
            const extraIds = matchedExtras.map(e => e._id);

            filter.$or = [
                { productName: { $regex: search, $options: 'i' } },
                { productDescription: { $regex: search, $options: 'i' } },
                { categoryId: { $in: catIds } },
                { subCategoryId: { $in: subIds } },
                { extraCategoryId: { $in: extraIds } }
            ];
        }
        if (subcategory) filter.subCategoryId = subcategory;
        if (category) filter.categoryId = category;
        if (extracategory) filter.extraCategoryId = extracategory;

        let sortOption = { createdAt: -1 };
        if (sort === 'priceLow') sortOption = { productPrice: 1 };
        if (sort === 'priceHigh') sortOption = { productPrice: -1 };

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await Product.find(filter)
            .populate('categoryId')
            .populate('subCategoryId')
            .populate('extraCategoryId')
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        res.render('web/home', {
        categories,
        subcategories,
        extracategories,
        products,
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        query: req.query,
        cartCount: req.session.cart ? req.session.cart.length : 0,
        user: req.user || null
      });
    } catch (error) {
        console.error("Web Home Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.productDetails = async (req, res) => {
    try {
        const categories = await Category.find({});
        const subcategories = await SubCategory.find({}).populate('categoryId');
        const extracategories = await ExtraCategory.find({}).populate('subCategoryId');
        const product = await Product.findById(req.params.id)
            .populate('categoryId')
            .populate('subCategoryId')
            .populate('extraCategoryId');

        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.render('web/webProductDetails', {
        product,
        categories,
        subcategories,
        extracategories,
        cartCount: req.session.cart ? req.session.cart.length : 0,
        user: req.user || null
      });
    } catch (error) {
        console.error("Web Product Details Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

// --- User Authentication ---

exports.loginPage = (req, res) => {
    if (req.isAuthenticated() && req.user.role === 'customer') return res.redirect('/');
    res.render('web/login');
};

exports.loginSuccess = (req, res) => {
    req.flash('success', 'Logged in successfully');
    res.redirect('/');
};

exports.signupPage = (req, res) => {
    if (req.isAuthenticated() && req.user.role === 'customer') return res.redirect('/');
    res.render('web/signup');
};

exports.signupUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });
        req.flash('success', 'Sign up successful! Please login.');
        res.redirect('/login');
    } catch (error) {
        console.error("Signup Error:", error);
        req.flash('error', 'Signup failed. Email might already exist.');
        res.redirect('/signup');
    }
};

exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Logged out successfully');
        res.redirect('/');
    });
};

exports.customerProfile = async (req, res) => {
    try {
        const categories = await Category.find({});
        const subcategories = await SubCategory.find({}).populate('categoryId');
        const extracategories = await ExtraCategory.find({}).populate('subCategoryId');
        
        res.render('web/profile', {
            categories,
            subcategories,
            extracategories,
            user: req.user,
            cartCount: req.session.cart ? req.session.cart.length : 0
        });
    } catch (error) {
        console.error("Customer Profile Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.ordersPage = async (req, res) => {
    try {
        const categories = await Category.find({});
        const subcategories = await SubCategory.find({}).populate('categoryId');
        const extracategories = await ExtraCategory.find({}).populate('subCategoryId');
        
        res.render('web/orders', {
            categories,
            subcategories,
            extracategories,
            user: req.user,
            cartCount: req.session.cart ? req.session.cart.length : 0
        });
    } catch (error) {
        console.error("Orders Page Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

// --- Cart Functionality ---

exports.addToCart = async (req, res) => {
    try {
        if (!req.isAuthenticated() || req.user.role !== 'customer') {
            req.flash('error', 'Please login to add products to cart');
            return res.redirect('/login');
        }

        const productId = req.params.id;
        const { size } = req.query;
        const product = await Product.findById(productId);
        
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/');
        }

        if (!size) {
            req.flash('error', 'Please select a size first');
            return res.redirect(`/product-details/${productId}`);
        }

        if (!req.session.cart) req.session.cart = [];
        
        const exists = req.session.cart.find(item => item.id === productId && item.size === size);
        if (!exists) {
            req.session.cart.push({
                id: productId,
                name: product.productName,
                price: product.productPrice,
                image: product.productImage,
                size: size,
                quantity: 1
            });
            req.flash('success', 'Product added to cart!');
        } else {
            req.flash('success', 'Product with this size already in cart');
        }
        
        // Explicitly save session before redirecting to ensure it persists and avoid race conditions
        req.session.save((err) => {
            if (err) {
                console.error("Session Save Error:", err);
                return res.redirect('/');
            }
            return res.redirect('/cart');
        });
    } catch (error) {
        console.error("Add to Cart Error:", error);
        req.flash('error', 'Error adding to cart');
        return res.redirect('/');
    }
};

exports.cartPage = async (req, res) => {
    try {
        const categories = await Category.find({});
        const subcategories = await SubCategory.find({}).populate('categoryId');
        const extracategories = await ExtraCategory.find({}).populate('subCategoryId');
        const cartItems = req.session.cart || [];
        const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        res.render('web/cart', {
        categories,
        subcategories,
        extracategories,
        cartItems,
        total: total.toLocaleString('en-IN'),
        cartCount: cartItems.length,
        user: req.user || null
      });
    } catch (error) {
        console.error("Cart Page Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.updateCart = (req, res) => {
    const { id, action } = req.params;
    const size = req.params.size || req.query.size;
    if (!req.session.cart) return res.redirect('/cart');

    let item;
    if (size) {
        item = req.session.cart.find(i => i.id === id && i.size === size);
    } else {
        item = req.session.cart.find(i => i.id === id);
    }

    if (item) {
        if (action === 'inc') item.quantity++;
        else if (action === 'dec' && item.quantity > 1) item.quantity--;
    }
    res.redirect('/cart');
};

exports.removeFromCart = (req, res) => {
    const { id } = req.params;
    const size = req.params.size || req.query.size;
    if (req.session.cart) {
        if (size) {
            req.session.cart = req.session.cart.filter(i => !(i.id === id && i.size === size));
        } else {
            req.session.cart = req.session.cart.filter(i => i.id !== id);
        }
        req.flash('success', 'Product removed from cart');
    }
    res.redirect('/cart');
};
