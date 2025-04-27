const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

function temp(req, res) {
  res.send("Hello World!");
}

app.get("/", temp);

function started() {
  console.log(`Server started on port ${port}`);
}
app.listen(port, started);

var sendgetCodeChefRatingObj = {
  method: "GET",
};

async function getCodeChefRating(username) {
  let result = -1;
  let url = `https://codechef-api.vercel.app/handle/${username}`;
  let fecthResult = await fetch(url, sendgetCodeChefRatingObj).catch(
    (error) => {
      console.error("Error:", error);
      return -1;
    }
  );
  if (fecthResult.status != 200) {
    return -1;
  }
  result = await fecthResult.json();
  if (result.status == 404) {
    return -1;
  }
  return result.currentRating;
}

var username = "battu";

var val = await getCodeChefRating(username).then((result) => {});
