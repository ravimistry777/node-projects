const Blog = require('../model/blog.model');
const path = require('path');
const fs = require('fs');

exports.blogPage = async(req , res) =>{
    try {
        return res.render("blog/addBlog");
    } catch (error) {
        console.log(error);
        res.redirect("/dashboard")
    }
}

exports.viewAllBlogs = async(req,res) => {
    try {
        let search = req.query.search ? req.query.search : "";
        let blogs = await Blog.find({
            $or: [
                {
                    "title": {$regex: search , $options: "i"}
                },
                {
                    "author": {$regex: search, $options: "i"}
                }
            ]
        })
        return res.render("blog/viewBlog", {blogs, query: req.query});
    } catch (error) {
        console.log(error);
        res.redirect("/dashboard");
    }
}

exports.addBlog = async(req,res) => {
    try {
        let imagepath = "";
        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`;
        }

        await Blog.create({
            ...req.body,
            blogImage: imagepath
        });
        
        req.flash('success', 'Blog Created Successfully');
        return res.redirect("/blog/view-blogs");
    } catch (error) {
        console.log("Error in addBlog:", error);
        req.flash('error', 'Something went wrong');
        res.redirect("/blog/add-blog");
    }
}

exports.deleteBlog = async(req,res)=> {
    try {
        let blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.redirect("/blog/view-blogs")
        }
        if (blog.blogImage != "") {
            let imagePath = path.join(__dirname, ".." , blog.blogImage);
            try {
                await fs.unlinkSync(imagePath);
            } catch (error) {
                console.log("File not found");
            }
        }

        await Blog.findByIdAndDelete(blog._id);
        req.flash('success', 'Blog Deleted Successfully');
        return res.redirect("/blog/view-blogs");


    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.updateBlogPage = async(req,res) => {
    try {
        let blog = await Blog.findById(req.params.id);
        return res.render("blog/updateBlog", {blog});
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.updateBlog = async(req,res) => {
    try {
        let blog = await Blog.findById(req.body.id);
        if(!blog){
            return res.redirect("/blog/view-blogs");
        }
        
        let imagepath = blog.blogImage;
        if(req.file){
            imagepath = `/uploads/${req.file.filename}`;
            if (blog.blogImage != "") {
                let oldImagePath = path.join(__dirname, ".." , blog.blogImage);
                try {
                    await fs.unlinkSync(oldImagePath);
                } catch (error) {
                    console.log("Old file not found");
                }
            }
        }

        await Blog.findByIdAndUpdate(req.body.id, {
            ...req.body,
            blogImage: imagepath
        });

        req.flash('success', 'Blog Updated Successfully');
        return res.redirect("/blog/view-blogs");

    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.readMore = async(req,res) => {
    try {
        let blog = await Blog.findById(req.params.id);
        return res.render("blog/readMore", {blog});
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}
