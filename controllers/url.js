const shortid = require('shortid');
const URL = require('../models/url'); // make sure it's imported

async function handleGenerateNewShortUrl(req, res){
    const body = req.body;
    if(!body.url) return res.status(400).json({ error: 'url is required' });

    const shortID = shortid();
    await URL.create({
        shortId: shortID,
        redirectUrl: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });

    // 🔧 Fetch all URLs to send to the template
    const allUrls = await URL.find({});

    // ✅ Render EJS and pass BOTH id and urls
    return res.render("home", {
        id: shortID,
        urls: allUrls,
    });
}


async function handleGetAnalytics(req, res){
    const shortId = req.params.shortId;
    const entry = await URL.findOne({
        shortId,
    });
    return res.json({
        totalClicks: entry.visitHistory.length,
        analytics: entry.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics,
};