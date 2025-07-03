const express = require('express');
const URL = require('../models/url'); // Ensure correct import of the model
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allUrls = await URL.find({createdBy: req.user._id}); // Fetch all URLs from the database
        res.render('home', { 
            id: null,  // No ID initially, it's populated after URL generation
            urls: allUrls 
        });
    } catch (error) {
        console.error("Error fetching URLs:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.get("/login", (req, res) => {
    return res.render("login");
});

module.exports = router;
