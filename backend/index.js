import express from "express";
import cors from "cors";
const app = express();
import bodyParser from "body-parser";
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

var sendCodeforcesResult = {
  method: "GET",
};

async function getCodeforcesRating(username) {
  let result = -1;
  let url = `https://codeforces.com/api/user.info?handles=${username}`;
  let fetchResult = await fetch(url, sendCodeforcesResult).catch((error) => {
    console.error("Error:", error);
    return -1;
  });
  if (fetchResult.status !== 200) {
    return -1;
  }
  result = await fetchResult.json();
  if (result.status === "error") {
    return -1;
  }
  return result.result[0].rating;
}

var username = "rishithabattu";
var val1 = await getCodeChefRating(username).then((result) => {
  console.log("codechef rating:", result);
});

var username = "M_Abhiram";
var val2 = await getCodeforcesRating(username).then((result) => {
  console.log("codeforces rating:", result);
});
