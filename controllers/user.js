const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs", { formValues: {} });
};

module.exports.signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Velora!");
            res.redirect("/listings");
        });
    } catch (e) {
        res.locals.error = [e.message];
        res.status(400).render("users/signup", { formValues: { username, email } });
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Velora!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out.");
        res.redirect("/listings");
    });
};
