export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            const error = new Error("Auth middleware must be called before authorize");
            error.status = 500; 
            return next(error);
        }

        if (allowedRoles.includes(req.user.role)) {
            return next();
        }

        const error = new Error("You do not have permission to perform this action");
        error.status = 403;
        next(error);
    };
};