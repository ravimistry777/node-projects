const Category = require('../model/category.model');
const SubCategory = require('../model/subCategory.model');
const ExtraCategory = require('../model/extraCategory.model');
const Product = require('../model/product.model');
const path = require('path');
const fs = require('fs');

exports.addCategoryPage = async(req , res) =>{
    try {
        return res.render("category/addCategory");
    } catch (error) {
        console.log(error);
        res.redirect("/dashboard")
    }
}

exports.viewAllCategories = async(req,res) => {
    try {
        let search = req.query.search ? req.query.search : "";
        let { status } = req.query;
        let query = {};

        if(search) {
            query.categoryName = { $regex: search , $options: "i" };
        }

        if(status) {
            query.status = status === 'true';
        }

        let categories = await Category.find(query);
        return res.render("category/viewCategory", {categories, query: req.query});
    } catch (error) {
        console.log(error);
        res.redirect("/dashboard");
    }
}

exports.addCategory = async(req,res) => {
    try {
        let imagepath = "";
        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`;
        }

        let category = await Category.create({
            ...req.body,
            categoryImage: imagepath
        });
        
        req.flash('success', 'Category Created Successfully');
        return res.redirect("/category/view-categories");
    } catch (error) {
        console.log("Error in addCategory:", error);
        req.flash('error', 'Something went wrong');
        res.redirect("/category/add-category");
    }
}

exports.deleteCategory = async(req,res)=> {
    try {
        let category = await Category.findById(req.params.id);
        if (!category) {
            return res.redirect("/category/view-categories")
        }
        
        // Delete associated subcategories
        await SubCategory.deleteMany({ categoryId: category._id });
        await ExtraCategory.deleteMany({ categoryId: category._id });
        await Product.deleteMany({ categoryId: category._id });

        if (category.categoryImage != "") {
            let imagePath = path.join(__dirname, ".." , category.categoryImage);
            try {
                if (fs.existsSync(imagePath)) {
                    await fs.unlinkSync(imagePath);
                }
            } catch (error) {
                console.log("File not found or error deleting");
            }
        }

        await Category.findByIdAndDelete(category._id);
        req.flash('success', 'Category and associated SubCategories Deleted Successfully');
        return res.redirect("/category/view-categories");


    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.updateCategoryPage = async(req,res) => {
    try {
        let category = await Category.findById(req.params.id);
        return res.render("category/updateCategory", {category});
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.updateCategory = async(req,res) => {
    try {
        let category = await Category.findById(req.body.id);
        if(!category){
            return res.redirect("/category/view-categories");
        }
        
        let imagepath = category.categoryImage;
        
        if(req.file){
             if (category.categoryImage != "") {
                let oldImagePath = path.join(__dirname, ".." , category.categoryImage);
                try {
                    if (fs.existsSync(oldImagePath)) {
                        await fs.unlinkSync(oldImagePath);
                    }
                } catch (error) {
                    console.log("Old file not found");
                }
            }
            imagepath = `/uploads/${req.file.filename}`;
        }

        await Category.findByIdAndUpdate(req.body.id, {
            ...req.body,
            categoryImage: imagepath
        });

        req.flash('success', 'Category Updated Successfully');
        return res.redirect("/category/view-categories");

    } catch (error) {
        console.log(error);
        req.flash('error', 'Something went wrong');
        return res.redirect("/category/view-categories");
    }
}
