const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/sendEmail');
const crypto = require('crypto');

exports.registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        let user = await User.findOne({ email: email });
        if (user && user.isDelete == false) {
            return res.status(400).json({ message: 'User already exist' })
        }
        
        let imagepath = "";
        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`;
        }
        let hashPassword = await bcrypt.hash(password, 12);
        
        const role = req.body.role || 'Admin';

        user = await User.create({
            ...req.body,
            password: hashPassword,
            profileImage: imagepath,
            role: role
        });
        return res.status(201).json({ message: 'User Register', user });
    } catch (error) {
        console.error('Error in registerUser:', error);
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        let user = await User.findOne({ email: email, isDelete: false })
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Email or Password is incorrect' });
        }

        let token = jwt.sign({ userId: user._id, role: user.role }, 'ravi.dev', { expiresIn: '1d' })
        return res.json({ message: 'Login Success', status: 200, token, role: user.role })

    } catch (error) {
        console.error('Error in loginUser:', error);
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

exports.createUser = async (req, res) => {
    try {
        const { email, role } = req.body;
        
        // Check if user already exists
        let user = await User.findOne({ email: email });
        if (user && !user.isDelete) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check permissions
        if (req.user.role === 'Admin') {
            if (!['Admin', 'Manager'].includes(role)) {
                return res.status(403).json({ message: 'Admin can only create Admins or Managers' });
            }
        } else if (req.user.role === 'Manager') {
            if (role !== 'Employee') {
                return res.status(403).json({ message: 'Manager can only create Employees' });
            }
        } else {
            return res.status(403).json({ message: 'Unauthorized to create users' });
        }

        let password = req.body.password;
        if (!password) {
            password = crypto.randomBytes(4).toString('hex');
        }
        const hashPassword = await bcrypt.hash(password, 12);

        let imagepath = "";
        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`;
        }

        const newUser = await User.create({
            ...req.body,
            password: hashPassword,
            profileImage: imagepath,
            role: role
        });

        await sendEmail(email, password, role);

        return res.json({ message: `${role} created successfully`, user: newUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.getAdmins = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Only Admin can view all Admins' });
        }
        let admins = await User.find({ role: 'Admin', isDelete: false });
        return res.json({ message: 'Fetch All Admins', admins });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.getManagers = async (req, res) => {
    try {
        if (!['Admin', 'Manager'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        let managers = await User.find({ role: 'Manager', isDelete: false });
        return res.json({ message: 'Fetch All Managers', managers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.getEmployees = async (req, res) => {
    try {
        let employees = await User.find({ role: 'Employee', isDelete: false });
        return res.json({ message: 'Fetch All Employees', employees });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);
        if (!targetUser || targetUser.isDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check permissions
        if (req.user.role === 'Admin') {
            if (!['Admin', 'Manager'].includes(targetUser.role)) {
                // Admin can also update employees if needed, but user didn't specify. 
            }
        } else if (req.user.role === 'Manager') {
            if (targetUser.role !== 'Employee') {
                return res.status(403).json({ message: 'Manager can only update Employees' });
            }
        } else {
            return res.status(403).json({ message: 'Unauthorized to update users' });
        }

        let imagepath = targetUser.profileImage;
        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            ...req.body,
            profileImage: imagepath
        }, { new: true });

        return res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);
        if (!targetUser || targetUser.isDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check permissions
        if (req.user.role === 'Admin') {
            if (!['Admin', 'Manager'].includes(targetUser.role)) {
             }
        } else if (req.user.role === 'Manager') {
            if (targetUser.role !== 'Employee') {
                return res.status(403).json({ message: 'Manager can only delete Employees' });
            }
        } else {
            return res.status(403).json({ message: 'Unauthorized to delete users' });
        }

        await User.findByIdAndUpdate(req.params.id, { isDelete: true });
        return res.json({ message: 'User soft deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
}
