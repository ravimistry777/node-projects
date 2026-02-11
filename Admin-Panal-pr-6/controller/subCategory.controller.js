const SubCategory = require('../model/subCategory.model');
const Category = require('../model/category.model');
const ExtraCategory = require('../model/extraCategory.model');
const Product = require('../model/product.model');

exports.addSubCategoryPage = async(req , res) =>{
    try {
        let categories = await Category.find({status: true});
        return res.render("subCategory/addSubCategory", {categories});
    } catch (error) {
        console.log(error);
        res.redirect("/dashboard")
    }
}

exports.viewAllSubCategories = async(req,res) => {
    try {
        let search = req.query.search ? req.query.search : "";
        let { categoryId } = req.query;
        let query = {};

        // 1. Search Logic
        if (search) {
            // Find IDs of matching categories
            const matchedCategories = await Category.find({ categoryName: { $regex: search, $options: 'i' } }).select('_id');
            
            query.$or = [
                { subCategoryName: { $regex: search, $options: "i" } },
                { categoryId: { $in: matchedCategories } }
            ];
        }

        // 2. Filter Logic
        if (categoryId) {
            query.categoryId = categoryId;
        }

        let subCategories = await SubCategory.find(query).populate('categoryId');
        let categories = await Category.find({ status: true });
        
        return res.render("subCategory/viewSubCategory", {
            subCategories, 
            query: req.query,
            categories
        });
    } catch (error) {
        console.log(error);
        res.redirect("/dashboard");
    }
}

exports.addSubCategory = async(req,res) => {
    try {
        await SubCategory.create(req.body);
        req.flash('success', 'SubCategory Created Successfully');
        return res.redirect("/subcategory/view-subcategories");
    } catch (error) {
        console.log("Error in addSubCategory:", error);
        req.flash('error', 'Something went wrong');
        res.redirect("/subcategory/add-subcategory");
    }
}

exports.deleteSubCategory = async(req,res)=> {
    try {
        let subCategory = await SubCategory.findById(req.params.id);
        if(!subCategory){
             return res.redirect("/subcategory/view-subcategories");
        }
        await ExtraCategory.deleteMany({ subCategoryId: subCategory._id });
        await Product.deleteMany({ subCategoryId: subCategory._id });
        
        await SubCategory.findByIdAndDelete(req.params.id);
        req.flash('success', 'SubCategory and associated items Deleted Successfully');
        return res.redirect("/subcategory/view-subcategories");
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.updateSubCategoryPage = async(req,res) => {
    try {
        let subCategory = await SubCategory.findById(req.params.id);
        let categories = await Category.find({status: true});
        return res.render("subCategory/updateSubCategory", {subCategory, categories});
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.updateSubCategory = async(req,res) => {
    try {
        await SubCategory.findByIdAndUpdate(req.body.id, req.body);
        req.flash('success', 'SubCategory Updated Successfully');
        return res.redirect("/subcategory/view-subcategories");
    } catch (error) {
        console.log(error);
        req.flash('error', 'Something went wrong');
        return res.redirect("/subcategory/view-subcategories");
    }
}
