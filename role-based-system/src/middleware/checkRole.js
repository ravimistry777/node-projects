exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (roles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({ message: 'Access Denied: You do not have permission to perform this action' });
        }
    };
};
