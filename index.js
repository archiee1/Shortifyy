const express = require('express');
const path = require('path');
const {connectToMongoDB} = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const cookieParser = require('cookie-parser');
const staticRoute = require("./routes/staticRouter");
const userRoute = require('./routes/user');
const {restrictToLoggedinUserOnly, checkAuth} = require('./middleware/auth');
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());

app.use(express.static('public'));


app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/test", async (req, res)=>{
    const allUrls = await URL.find({});
    return res.render('home', {
        urls: allUrls,
    });
})

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);



app.get('/:shortId', async (req, res)=>{
    const shortId = req.params.shortId;
   const entry = await URL.findOneAndUpdate({
        shortId,
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            }
        },
    }
);
 if (!entry) {
    return res.status(404).send('Short URL not found');
  }

  res.redirect(entry.redirectUrl);
})

app.post('/clear', async (req, res) => {
  try {
    await URL.deleteMany({});
    res.redirect('/');
  } catch (err) {
    console.error("Failed to clear URLs:", err);
    res.status(500).send("Internal Server Error");
  }
});


connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB", err));

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));