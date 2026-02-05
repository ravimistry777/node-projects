const Admin = require('../model/admin.model');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

exports.addAdminPage = async(req , res) =>{
    try {
        return res.render("admin/addAdmin");
    } catch (error) {
        console.log(error);
        res.redirect("/dashboard")
    }
}

exports.viewAllAdmins = async(req,res) => {
    try {
        let search = req.query.search ? req.query.search : "";
        let admins = await Admin.find({
            $or: [
                {
                    "firstname": {$regex: search , $options: "i"}
                },
                {
                    "lastname": {$regex: search, $options: "i"}
                }
            ]
        })
        return res.render("admin/viewAdmin", {admins, query: req.query});
    } catch (error) {
        console.log(error);
        res.redirect("/dashboard");
    }
}

exports.addAdmin = async(req,res) => {
    try {
        let imagepath = "";
        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`;
        }
        let hashpassword = await bcrypt.hash(req.body.password, 7);

        let admin = await Admin.create({
            ...req.body,
            password: hashpassword,
            profileImage: imagepath
        });
        
        req.flash('success', 'Admin Created Successfully');
        return res.redirect("/admin/view-admins");
    } catch (error) {
        console.log("Error in addAdmin:", error);
        req.flash('error', 'Something went wrong');
        res.redirect("/admin/add-admin");
    }
}

exports.deleteAdmin = async(req,res)=> {
    try {
        let admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.redirect("/admin/view-admins")
        }
        if (admin.profileImage != "") {
            let imagePath = path.join(__dirname, ".." , admin.profileImage);
            try {
                await fs.unlinkSync(imagePath);
            } catch (error) {
                console.log("File not found");
            }
        }

        await Admin.findByIdAndDelete(admin._id);
        req.flash('success', 'Admin Deleted Successfully');
        return res.redirect("/admin/view-admins");


    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.updateAdminPage = async(req,res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        return res.render("admin/updateAdmin", {admin});
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.updateAdmin = async(req,res) => {
    try {
        let admin = await Admin.findById(req.body.id);
        if(!admin){
            return res.redirect("/admin/view-admins");
        }
        
        let imagepath = admin.profileImage;
        
        if(req.file){
             if (admin.profileImage != "") {
                let oldImagePath = path.join(__dirname, ".." , admin.profileImage);
                try {
                    await fs.unlinkSync(oldImagePath);
                } catch (error) {
                    console.log("Old file not found");
                }
            }
            imagepath = `/uploads/${req.file.filename}`;
        }

        await Admin.findByIdAndUpdate(req.body.id, {
            ...req.body,
            profileImage: imagepath
        });

        req.flash('success', 'Admin Updated Successfully');
        return res.redirect("/admin/view-admins");

    } catch (error) {
        console.log(error);
        req.flash('error', 'Something went wrong');
        return res.redirect("/admin/view-admins");
    }
}