const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/scrape", async (req, res) => {
  const [marvelsContent] = await Promise.all([
    axios.get("https://creditingmarvels.wordpress.com/page/13/"),
  ]);
  const $ = cheerio.load(marvelsContent.data);

  $(`.post`).each((i, post) => {
    const title = $(post).find(`h2.entry-title`).find("a").text();
    const date = $(post).find(`div.entry-meta`).find("a").find(`span`).text();
    const formattedDate = moment(date, "MMMM DD, YYYY");
    const body = $(post).find("div.entry-content").html();

    console.log("HERE: ", $(post).find("div.entry-content").html());

    // console.log(`T: ${title}, D: ${date}`);
    // console.log("FD: ",formattedDate.format());

    const newPost = {
      Title: title,
      Body: body,
      DatePublished: formattedDate.format("YYYY-MM-DD"),
    };

    axios.post("https://admin.grahamwebworks.com/api/sl-blogs", {
      data: newPost,
    });
  });
});

app.listen(3000, () => {
  console.log("App running on port 3000!");
});
