// THIS GRABS CONTENT FROM SEEKINGLIFE.BLOG

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/scrape", async (req, res) => {
  const [blog] = await Promise.all([
    axios.get("https://seekinglife.blog/page/4/"),
  ]);
  const $ = cheerio.load(blog.data);

  $(`.post`).each((i, post) => {
    const title = $(post).find(`h2.entry-title`).find("a").text();
    const date = $(post).find(`div.entry-meta`).find(".posted-on").find(`a`).text();
    const formattedDate = moment(date, "MMMM DD, YYYY");
    const body = $(post).find("div.entry-content").html();

//     console.log("HERE: ", $(post).find("div.entry-content").html());

    // console.log(`T: ${title}, D: ${date}`);
    // console.log("FD: ",formattedDate.format());

    const newPost = {
      Title: title,
      Body: body,
      DatePublished: formattedDate.format("YYYY-MM-DD"),
    };

    console.log("HERE: ", newPost)

    axios.post("https://admin.grahamwebworks.com/api/sl-blogs", {
      data: newPost,
    });
  });
});

app.listen(3000, () => {
  console.log("App running on port 3000!");
});
