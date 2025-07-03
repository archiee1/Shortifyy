const User = require('../models/users');
const URL = require('../models/url');
const {v4: uuidv4} = require('uuid');
const {setUser} = require('../service/auth');

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.render("signup", { error: "User already exists!" });
    }

    // Create new user
    await User.create({ name, email, password });

    // Redirect to login page after signup
    return res.redirect("/login");
}

async function handleUserLogin(req, res){
    const { name, email, password } = req.body;
    const user = await User.findOne({email, password});
    if(!user) {
        return res.render("login", {
            error: "Invalid username or password",
        });
        
    }
    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId);

    return res.redirect("/");
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
};