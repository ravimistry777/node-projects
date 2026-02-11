const Category = require('../model/category.model');
const SubCategory = require('../model/subCategory.model');
const ExtraCategory = require('../model/extraCategory.model');

// Render Add Extra Category Page
exports.addExtraCategoryPage = async (req, res) => {
    try {
        let categories = await Category.find({ status: true });
        return res.render("extraCategory/addExtraCategory", { categories });
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

// Add Extra Category
exports.addExtraCategory = async (req, res) => {
    try {
        await ExtraCategory.create(req.body);
        req.flash('success', 'Extra Category Added Successfully');
        return res.redirect("/extracategory/view-extracategories");
    } catch (error) {
        console.log(error);
        req.flash('error', 'Something went wrong');
        return res.redirect("/extracategory/add-extracategory");
    }
}

// View Extra Categories
exports.viewExtraCategories = async (req, res) => {
    try {
        let search = req.query.search ? req.query.search : "";
        let { categoryId, subCategoryId } = req.query;
        let query = {};

        // 1. Search Logic
        if (search) {
            const matchedCategories = await Category.find({ categoryName: { $regex: search, $options: 'i' } }).select('_id');
            const matchedSubCategories = await SubCategory.find({ subCategoryName: { $regex: search, $options: 'i' } }).select('_id');

            query.$or = [
                { extraCategoryName: { $regex: search, $options: "i" } },
                { categoryId: { $in: matchedCategories } },
                { subCategoryId: { $in: matchedSubCategories } }
            ];
        }

        // 2. Filter Logic
        if (categoryId) query.categoryId = categoryId;
        if (subCategoryId) query.subCategoryId = subCategoryId;

        let extraCategories = await ExtraCategory.find(query)
            .populate('categoryId')
            .populate('subCategoryId');
        
        let categories = await Category.find({ status: true });
        
        return res.render("extraCategory/viewExtraCategory", { 
            extraCategories, 
            query: req.query,
            categories 
        });
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

const Product = require('../model/product.model');

// Delete Extra Category
exports.deleteExtraCategory = async (req, res) => {
    try {
        let extraCategory = await ExtraCategory.findById(req.params.id);
        if(!extraCategory){
            return res.redirect("/extracategory/view-extracategories");
        }
        
        await Product.deleteMany({ extraCategoryId: extraCategory._id });

        await ExtraCategory.findByIdAndDelete(req.params.id);
        req.flash('success', 'Extra Category and associated Products Deleted Successfully');
        return res.redirect("/extracategory/view-extracategories");
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

// AJAX: Get SubCategories by Category ID (Reusing logic if needed, but usually accessed via route)
exports.getSubCategories = async (req, res) => {
    try {
        let subCategories = await SubCategory.find({ categoryId: req.query.id, status: true });
        return res.json({ subCategories });
    } catch (error) {
        console.log(error);
        return res.json({ subCategories: [] });
    }
}
